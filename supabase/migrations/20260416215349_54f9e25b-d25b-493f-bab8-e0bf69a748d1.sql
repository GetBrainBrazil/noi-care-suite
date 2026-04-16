-- Mini CRM domain: leads, conversations, messages, follow-ups, tasks, appointments cache

-- =========================
-- ENUMS
-- =========================
DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('novo','qualificado','em_atendimento','agendado','compareceu','convertido','perdido');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.lead_channel AS ENUM ('whatsapp','instagram','indicacao','manual','outro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.conversation_status AS ENUM ('ativa','aguardando','encerrada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.message_sender AS ENUM ('ai','lead','human');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.message_direction AS ENUM ('inbound','outbound');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.follow_up_type AS ENUM ('pos_consulta','tratamento_nao_concluido','rechamada_longa','paciente_sumiu','confirmacao_orcamento','aniversario','retorno_recorrente','custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.follow_up_status AS ENUM ('pendente','aprovado','enviado','cancelado','falhou');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('aberta','em_andamento','concluida','cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.task_priority AS ENUM ('baixa','media','alta','urgente');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.lost_reason AS ENUM ('preco','distancia','tempo_espera','concorrente','sem_resposta','outro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- LEADS
-- =========================
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  cpf text,
  channel public.lead_channel NOT NULL,
  external_contact_id text,
  status public.lead_status NOT NULL DEFAULT 'novo',
  procedure_interest text,
  estimated_value_brl numeric(12,2),
  score smallint CHECK (score BETWEEN 0 AND 100),
  lost_reason public.lost_reason,
  lost_notes text,
  patient_external_id text,
  source_campaign text,
  referral_source text,
  assigned_to uuid REFERENCES auth.users(id),
  notes text,
  last_interaction_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX leads_clinic_channel_external_uniq
  ON public.leads (clinic_id, channel, external_contact_id)
  WHERE external_contact_id IS NOT NULL;
CREATE INDEX leads_clinic_status_idx ON public.leads (clinic_id, status);
CREATE INDEX leads_clinic_last_interaction_idx ON public.leads (clinic_id, last_interaction_at DESC);
CREATE INDEX leads_clinic_assigned_idx ON public.leads (clinic_id, assigned_to);

-- =========================
-- LEAD TAGS
-- =========================
CREATE TABLE public.lead_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, name)
);

CREATE TABLE public.lead_tag_assignments (
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.lead_tags(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lead_id, tag_id)
);

-- =========================
-- LEAD CONSENTS
-- =========================
CREATE TABLE public.lead_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  reminders_opt_in boolean NOT NULL DEFAULT true,
  data_sharing_opt_in boolean NOT NULL DEFAULT false,
  consent_source text,
  consented_at timestamptz,
  revoked_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id)
);

-- =========================
-- CONVERSATIONS
-- =========================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  channel public.lead_channel NOT NULL,
  status public.conversation_status NOT NULL DEFAULT 'ativa',
  ai_paused boolean NOT NULL DEFAULT false,
  handoff_reason text,
  handoff_at timestamptz,
  handoff_by uuid REFERENCES auth.users(id),
  assigned_to uuid REFERENCES auth.users(id),
  last_message_at timestamptz,
  unread_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, channel)
);

CREATE INDEX conversations_clinic_status_last_msg_idx
  ON public.conversations (clinic_id, status, last_message_at DESC);
CREATE INDEX conversations_clinic_ai_paused_idx
  ON public.conversations (clinic_id, ai_paused) WHERE ai_paused = true;

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender public.message_sender NOT NULL,
  direction public.message_direction NOT NULL,
  content text NOT NULL,
  media_url text,
  media_type text,
  ai_confidence numeric(3,2) CHECK (ai_confidence BETWEEN 0 AND 1),
  sent_by uuid REFERENCES auth.users(id),
  external_message_id text,
  delivery_status text CHECK (delivery_status IN ('sent','delivered','read','failed')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_conversation_created_idx ON public.messages (conversation_id, created_at DESC);
CREATE INDEX messages_clinic_created_idx ON public.messages (clinic_id, created_at DESC);
CREATE UNIQUE INDEX messages_external_id_uniq ON public.messages (external_message_id) WHERE external_message_id IS NOT NULL;

-- =========================
-- FOLLOW-UP TEMPLATES
-- =========================
CREATE TABLE public.follow_up_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  type public.follow_up_type NOT NULL,
  name text NOT NULL,
  message_template text NOT NULL,
  days_offset integer,
  is_active boolean NOT NULL DEFAULT true,
  requires_approval boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, type, name)
);

-- =========================
-- FOLLOW-UPS
-- =========================
CREATE TABLE public.follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.follow_up_templates(id),
  type public.follow_up_type NOT NULL,
  scheduled_for timestamptz NOT NULL,
  message_preview text NOT NULL,
  channel public.lead_channel NOT NULL,
  status public.follow_up_status NOT NULL DEFAULT 'pendente',
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  sent_at timestamptz,
  error_message text,
  created_by text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX follow_ups_clinic_status_scheduled_idx ON public.follow_ups (clinic_id, status, scheduled_for);
CREATE INDEX follow_ups_clinic_lead_idx ON public.follow_ups (clinic_id, lead_id);

-- =========================
-- TASKS
-- =========================
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  priority public.task_priority NOT NULL DEFAULT 'media',
  status public.task_status NOT NULL DEFAULT 'aberta',
  assigned_to uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tasks_clinic_status_priority_idx ON public.tasks (clinic_id, status, priority);
CREATE INDEX tasks_clinic_assigned_status_idx ON public.tasks (clinic_id, assigned_to, status);

-- =========================
-- APPOINTMENTS CACHE
-- =========================
CREATE TABLE public.appointments_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  external_appointment_id text NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  patient_external_id text NOT NULL,
  patient_name text NOT NULL,
  doctor_name text,
  doctor_external_id text,
  procedure text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer,
  status text,
  synced_at timestamptz NOT NULL DEFAULT now(),
  raw_payload jsonb,
  UNIQUE (clinic_id, external_appointment_id)
);

CREATE INDEX appointments_cache_clinic_scheduled_idx ON public.appointments_cache (clinic_id, scheduled_at);
CREATE INDEX appointments_cache_clinic_doctor_scheduled_idx ON public.appointments_cache (clinic_id, doctor_external_id, scheduled_at);

-- =========================
-- updated_at TRIGGERS
-- =========================
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lead_consents_updated_at BEFORE UPDATE ON public.lead_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_follow_up_templates_updated_at BEFORE UPDATE ON public.follow_up_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- ENABLE RLS
-- =========================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments_cache ENABLE ROW LEVEL SECURITY;

-- =========================
-- RLS POLICIES — clinic_id tables
-- =========================

-- leads
CREATE POLICY "Members view leads" ON public.leads FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert leads" ON public.leads FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update leads" ON public.leads FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- lead_tags
CREATE POLICY "Members view lead_tags" ON public.lead_tags FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert lead_tags" ON public.lead_tags FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update lead_tags" ON public.lead_tags FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete lead_tags" ON public.lead_tags FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- conversations
CREATE POLICY "Members view conversations" ON public.conversations FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert conversations" ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update conversations" ON public.conversations FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete conversations" ON public.conversations FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- follow_up_templates
CREATE POLICY "Members view follow_up_templates" ON public.follow_up_templates FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert follow_up_templates" ON public.follow_up_templates FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update follow_up_templates" ON public.follow_up_templates FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete follow_up_templates" ON public.follow_up_templates FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- follow_ups
CREATE POLICY "Members view follow_ups" ON public.follow_ups FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert follow_ups" ON public.follow_ups FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update follow_ups" ON public.follow_ups FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete follow_ups" ON public.follow_ups FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- tasks
CREATE POLICY "Members view tasks" ON public.tasks FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert tasks" ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update tasks" ON public.tasks FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete tasks" ON public.tasks FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- appointments_cache
CREATE POLICY "Members view appointments_cache" ON public.appointments_cache FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members insert appointments_cache" ON public.appointments_cache FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Members update appointments_cache" ON public.appointments_cache FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_member(auth.uid(), clinic_id));
CREATE POLICY "Admins delete appointments_cache" ON public.appointments_cache FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_clinic_admin(auth.uid(), clinic_id));

-- =========================
-- RLS POLICIES — junction tables (parent-lookup)
-- =========================

-- lead_tag_assignments (parent: leads)
CREATE POLICY "Members view lead_tag_assignments" ON public.lead_tag_assignments FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_tag_assignments.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Members insert lead_tag_assignments" ON public.lead_tag_assignments FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_tag_assignments.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Members update lead_tag_assignments" ON public.lead_tag_assignments FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_tag_assignments.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Admins delete lead_tag_assignments" ON public.lead_tag_assignments FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_tag_assignments.lead_id
      AND public.is_clinic_admin(auth.uid(), l.clinic_id)
  ));

-- lead_consents (parent: leads)
CREATE POLICY "Members view lead_consents" ON public.lead_consents FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_consents.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Members insert lead_consents" ON public.lead_consents FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_consents.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Members update lead_consents" ON public.lead_consents FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_consents.lead_id
      AND public.is_clinic_member(auth.uid(), l.clinic_id)
  ));
CREATE POLICY "Admins delete lead_consents" ON public.lead_consents FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.leads l WHERE l.id = lead_consents.lead_id
      AND public.is_clinic_admin(auth.uid(), l.clinic_id)
  ));

-- messages (parent: conversations)
CREATE POLICY "Members view messages" ON public.messages FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id
      AND public.is_clinic_member(auth.uid(), c.clinic_id)
  ));
CREATE POLICY "Members insert messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id
      AND public.is_clinic_member(auth.uid(), c.clinic_id)
  ));
CREATE POLICY "Members update messages" ON public.messages FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id
      AND public.is_clinic_member(auth.uid(), c.clinic_id)
  ));
CREATE POLICY "Admins delete messages" ON public.messages FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id
      AND public.is_clinic_admin(auth.uid(), c.clinic_id)
  ));

-- =========================
-- SEED: default follow-up templates for "NOI Odonto"
-- =========================
INSERT INTO public.follow_up_templates (clinic_id, type, name, message_template, days_offset, is_active, requires_approval)
SELECT c.id, t.type, t.name, t.message_template, t.days_offset, true, true
FROM public.clinics c
CROSS JOIN (VALUES
  ('pos_consulta'::public.follow_up_type, 'Feedback pós-consulta', 'Olá {{nome}}, tudo bem? Gostaríamos de saber como foi sua experiência conosco hoje. Podemos contar com seu feedback? 💜', 1),
  ('tratamento_nao_concluido'::public.follow_up_type, 'Retomada de tratamento', 'Olá {{nome}}, notamos que seu tratamento de {{procedimento}} ficou pausado. Podemos ajudar a retomar? Temos horários disponíveis esta semana.', 30),
  ('rechamada_longa'::public.follow_up_type, 'Re-chamada paciente antigo', 'Olá {{nome}}, faz um tempo que não nos vemos! Que tal agendar uma avaliação de rotina? A saúde do seu sorriso merece atenção contínua. 🦷', 1825),
  ('paciente_sumiu'::public.follow_up_type, 'Paciente não retornou após primeira consulta', 'Olá {{nome}}, ficamos com sua saúde em mente. Você teve alguma dúvida sobre o que conversamos na consulta? Estou aqui para ajudar.', 7),
  ('confirmacao_orcamento'::public.follow_up_type, 'Confirmação de orçamento', 'Olá {{nome}}, pensou com carinho sobre o plano de tratamento que apresentamos? Qualquer dúvida estou à disposição. Podemos conversar sobre condições?', 3)
) AS t(type, name, message_template, days_offset)
WHERE c.name = 'NOI Odonto'
ON CONFLICT (clinic_id, type, name) DO NOTHING;