
## Multi-Clínica (Multi-Tenant) — Plano

A plataforma hoje assume uma única clínica. Vou introduzir o conceito de **Clínica** como entidade central; usuários, cargos atribuídos, leads, agenda, atendimentos e configurações passam a ser vinculados a uma clínica. Um seletor no topo do sidebar permite alternar entre clínicas.

### 1. Banco de dados

**Nova tabela `clinics`:** `id`, `name`, `cnpj`, `phone`, `email`, `address`, `is_active`, `created_at`, `updated_at`.

**Nova tabela `clinic_members`** (usuário ↔ clínica + cargo naquela clínica):
- `id`, `clinic_id`, `user_id`, `role_id`, `is_default`, `created_at`
- UNIQUE(`clinic_id`, `user_id`)
- Substitui o uso de `user_roles` (mantida por compatibilidade durante a migração).

**Migração de dados:** cria clínica seed "NOI Odonto" e move todos os usuários existentes como membros, preservando seus cargos atuais.

**Funções security definer (novas/atualizadas):**
- `is_super_admin(_user_id)` — admin em qualquer clínica; pode criar/editar clínicas
- `is_clinic_admin(_user_id, _clinic_id)`
- `is_clinic_member(_user_id, _clinic_id)`
- `has_module_access(_user_id, _clinic_id, _module)`

**RLS:** todas as tabelas filtradas por `clinic_id` + membership. Admin de uma clínica só vê dados dela.

### 2. Frontend — contexto e UI

**Novo `ClinicContext`** (`src/contexts/ClinicContext.tsx`):
- Lista de clínicas do usuário, `activeClinic` persistido em `localStorage`, `switchClinic(id)`.
- Permissões recalculadas ao trocar.

**Novo `ClinicSwitcher`** no topo do `AppSidebar` — dropdown com as clínicas do usuário (oculto se houver só uma).

**Configurações ganha nova aba "Clínicas"** (super-admin): listar/criar/editar/desativar clínicas. A aba "Ajustes da Clínica" passa a editar a **clínica ativa** em vez de dados hardcoded.

**Aba Usuários:** mostra apenas membros da clínica ativa; aprovar/atribuir cargo vincula o usuário à clínica ativa; botão "Adicionar a outra clínica" para multi-clínica.

**Aba Cargos & Permissões:** cargos do sistema (Admin, Dentista, Recepção, Marketing) seguem globais; admin pode criar cargos custom específicos por clínica.

**Demais módulos** (Leads, Agenda, Atendimento, IA Config, Dashboard): header passa a mostrar discretamente o nome da clínica ativa; estrutura preparada para filtro por `clinic_id` quando os dados forem reais.

### 3. Fluxo de cadastro
- Novo signup: `pending`, **sem clínica**.
- Admin aprova **e** atribui à(s) clínica(s) com cargo na aba Usuários.

### 4. Decisões padrão (vou seguir, me avise se quiser mudar)
- **Seed:** uma clínica "NOI Odonto" com todos os usuários atuais.
- **Admin:** por clínica, com conceito de Super Admin global (recomendado).
- **Cargos:** híbrido — sistema globais + custom por clínica.
- **Seletor:** no topo do sidebar.

### 5. Arquivos

**Novos:** migration `multi_clinic.sql`, `ClinicContext.tsx`, `ClinicSwitcher.tsx`, `settings/ClinicasPanel.tsx`.
**Editados:** `AuthContext.tsx`, `ProtectedRoute.tsx`, `AppSidebar.tsx`, `UsuariosPanel.tsx`, `CargosPanel.tsx`, `Configuracoes.tsx`, `App.tsx` e headers das páginas operacionais.
