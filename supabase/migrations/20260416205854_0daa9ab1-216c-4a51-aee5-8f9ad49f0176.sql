
-- =========================================
-- 1. CLINICS TABLE
-- =========================================
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_clinics_updated_at
BEFORE UPDATE ON public.clinics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 2. CLINIC_MEMBERS TABLE
-- =========================================
CREATE TABLE public.clinic_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, user_id)
);

ALTER TABLE public.clinic_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_clinic_members_user ON public.clinic_members(user_id);
CREATE INDEX idx_clinic_members_clinic ON public.clinic_members(clinic_id);

-- =========================================
-- 3. SECURITY DEFINER FUNCTIONS
-- =========================================

-- Super admin = has the global "Administrador" role in user_roles
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id AND r.name = 'Administrador'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_clinic_member(_user_id UUID, _clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clinic_members
    WHERE user_id = _user_id AND clinic_id = _clinic_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_clinic_admin(_user_id UUID, _clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_super_admin(_user_id) OR EXISTS (
    SELECT 1
    FROM public.clinic_members cm
    JOIN public.roles r ON r.id = cm.role_id
    WHERE cm.user_id = _user_id
      AND cm.clinic_id = _clinic_id
      AND r.name = 'Administrador'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_clinic_module_access(_user_id UUID, _clinic_id UUID, _module app_module)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_super_admin(_user_id) OR EXISTS (
    SELECT 1
    FROM public.clinic_members cm
    JOIN public.role_permissions rp ON rp.role_id = cm.role_id
    WHERE cm.user_id = _user_id
      AND cm.clinic_id = _clinic_id
      AND rp.module = _module
  );
$$;

-- =========================================
-- 4. RLS POLICIES — clinics
-- =========================================
CREATE POLICY "Members view their clinics"
ON public.clinics FOR SELECT TO authenticated
USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), id));

CREATE POLICY "Super admins insert clinics"
ON public.clinics FOR INSERT TO authenticated
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Clinic admins update clinic"
ON public.clinics FOR UPDATE TO authenticated
USING (public.is_clinic_admin(auth.uid(), id));

CREATE POLICY "Super admins delete clinics"
ON public.clinics FOR DELETE TO authenticated
USING (public.is_super_admin(auth.uid()));

-- =========================================
-- 5. RLS POLICIES — clinic_members
-- =========================================
CREATE POLICY "Users view own memberships"
ON public.clinic_members FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_clinic_admin(auth.uid(), clinic_id));

CREATE POLICY "Clinic admins insert members"
ON public.clinic_members FOR INSERT TO authenticated
WITH CHECK (public.is_clinic_admin(auth.uid(), clinic_id));

CREATE POLICY "Clinic admins update members"
ON public.clinic_members FOR UPDATE TO authenticated
USING (public.is_clinic_admin(auth.uid(), clinic_id));

CREATE POLICY "Clinic admins delete members"
ON public.clinic_members FOR DELETE TO authenticated
USING (public.is_clinic_admin(auth.uid(), clinic_id));

-- =========================================
-- 6. SEED DATA — "NOI Odonto" + migrate users
-- =========================================
DO $$
DECLARE
  seed_clinic_id UUID;
BEGIN
  INSERT INTO public.clinics (name, is_active)
  VALUES ('NOI Odonto', true)
  RETURNING id INTO seed_clinic_id;

  -- Migrate every existing user_role assignment into clinic_members
  INSERT INTO public.clinic_members (clinic_id, user_id, role_id, is_default)
  SELECT seed_clinic_id, ur.user_id, ur.role_id, true
  FROM public.user_roles ur
  ON CONFLICT (clinic_id, user_id) DO NOTHING;
END $$;

-- =========================================
-- 7. UPDATE handle_new_user — first user becomes super admin (no clinic auto-assign)
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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
