-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.app_module AS ENUM (
  'dashboard',
  'atendimento',
  'leads',
  'agenda',
  'ia-config',
  'upload',
  'suporte',
  'configuracoes'
);

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  status public.approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================
-- ROLES
-- =========================================
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================
-- ROLE PERMISSIONS (cargo -> módulo)
-- =========================================
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  module public.app_module NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (role_id, module)
);

-- =========================================
-- USER ROLES (usuário -> cargo)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role_id)
);

-- =========================================
-- updated_at trigger function
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- SECURITY DEFINER HELPERS
-- =========================================
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name = 'Administrador'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_approved(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND status = 'approved'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_module_access(_user_id UUID, _module public.app_module)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    WHERE ur.user_id = _user_id
      AND rp.module = _module
  );
$$;

-- =========================================
-- handle_new_user — cria profile + 1º vira admin aprovado
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
  admin_role_id UUID;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;

  INSERT INTO public.profiles (user_id, email, full_name, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN user_count = 0 THEN 'approved'::public.approval_status ELSE 'pending'::public.approval_status END
  );

  IF user_count = 0 THEN
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'Administrador' LIMIT 1;
    IF admin_role_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role_id) VALUES (NEW.id, admin_role_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- ENABLE RLS
-- =========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===== profiles =====
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete profiles" ON public.profiles
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ===== roles =====
CREATE POLICY "Authenticated read roles" ON public.roles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert roles" ON public.roles
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update roles" ON public.roles
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete non-system roles" ON public.roles
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()) AND is_system = false);

-- ===== role_permissions =====
CREATE POLICY "Authenticated read role_permissions" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert role_permissions" ON public.role_permissions
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete role_permissions" ON public.role_permissions
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ===== user_roles =====
CREATE POLICY "Users view own user_roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all user_roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins insert user_roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete user_roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- =========================================
-- SEED: cargos padrão + permissões
-- =========================================
INSERT INTO public.roles (name, description, is_system) VALUES
  ('Administrador', 'Acesso total à plataforma', true),
  ('Dentista', 'Acesso clínico — agenda, atendimento e leads', false),
  ('Recepção', 'Atendimento, agenda e leads', false),
  ('Marketing', 'Leads, IA e dashboards', false);

-- Admin: todos os módulos
INSERT INTO public.role_permissions (role_id, module)
SELECT r.id, m::public.app_module
FROM public.roles r
CROSS JOIN unnest(ARRAY['dashboard','atendimento','leads','agenda','ia-config','upload','suporte','configuracoes']) AS m
WHERE r.name = 'Administrador';

-- Dentista
INSERT INTO public.role_permissions (role_id, module)
SELECT r.id, m::public.app_module
FROM public.roles r
CROSS JOIN unnest(ARRAY['dashboard','atendimento','agenda','leads','suporte']) AS m
WHERE r.name = 'Dentista';

-- Recepção
INSERT INTO public.role_permissions (role_id, module)
SELECT r.id, m::public.app_module
FROM public.roles r
CROSS JOIN unnest(ARRAY['dashboard','atendimento','agenda','leads','suporte']) AS m
WHERE r.name = 'Recepção';

-- Marketing
INSERT INTO public.role_permissions (role_id, module)
SELECT r.id, m::public.app_module
FROM public.roles r
CROSS JOIN unnest(ARRAY['dashboard','leads','ia-config','upload','suporte']) AS m
WHERE r.name = 'Marketing';