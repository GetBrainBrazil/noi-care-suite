
Vou adicionar um modal (Dialog) que abre ao clicar no card do usuário, mostrando uma visualização detalhada com todos os dados dele.

### O que o modal vai mostrar

**Cabeçalho**
- Avatar grande com gradiente + iniciais
- Nome completo, e-mail, badge de status (Ativo/Pendente)

**Seção: Acesso & Permissões**
- Cargo na unidade ativa
- Lista de unidades em que participa (Barra, Ipanema, Recreio) com o cargo em cada uma
- Módulos liberados (Dashboard, Agenda, Leads, etc.) como chips

**Seção: Dados Profissionais** (visível para todos, com campos opcionais — preenchidos só se for dentista)
- CRO (número de registro)
- Especializações (multi: Ortodontia, Implantodontia, Endodontia, Periodontia, Estética, Odontopediatria, Cirurgia, Prótese, Clínico Geral)
- Áreas de atuação / procedimentos que realiza
- Bio / mini currículo

**Seção: Contato & Pessoal**
- Telefone / WhatsApp
- Data de nascimento
- Endereço

**Seção: Sistema**
- Data de cadastro
- Último acesso (se disponível)
- ID interno (discreto, em monoespaçada)

### Comportamento
- Card vira clicável (cursor-pointer + hover sutil já existe).
- O menu de ações (...) continua funcionando sem abrir o modal (stopPropagation).
- Para **admin** da unidade: botão "Editar dados profissionais" no rodapé do modal abre formulário inline para preencher CRO, especializações, etc.
- Para **não-admin**: modal apenas leitura.

### Backend
Hoje `profiles` só tem: full_name, email, avatar_url, status. Preciso adicionar campos profissionais. Migration:

```sql
ALTER TABLE profiles ADD COLUMN phone text;
ALTER TABLE profiles ADD COLUMN birth_date date;
ALTER TABLE profiles ADD COLUMN address text;
ALTER TABLE profiles ADD COLUMN cro text;              -- registro do dentista
ALTER TABLE profiles ADD COLUMN specializations text[]; -- array de especializações
ALTER TABLE profiles ADD COLUMN procedures text[];      -- procedimentos/áreas de atuação
ALTER TABLE profiles ADD COLUMN bio text;
ALTER TABLE profiles ADD COLUMN last_sign_in_at timestamptz;
```

Todos opcionais (nullable) — perfis existentes continuam funcionando. Detecção "é dentista?" = cargo na unidade contém "Dentista" (case-insensitive); se sim, a seção profissional aparece em destaque, senão fica colapsada/oculta.

### Arquivos
- **Migration:** adicionar colunas em `profiles`
- **Novo:** `src/components/settings/UserDetailDialog.tsx` (modal completo + form de edição)
- **Editado:** `src/components/settings/UsuariosPanel.tsx` (card clicável, abre o dialog, passa o usuário selecionado)
