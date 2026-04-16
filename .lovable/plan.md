
Vou criar as duas novas clínicas (Ipanema e Recreio), renomear a clínica seed atual ("NOI Odonto") para "Barra da Tijuca", e melhorar a experiência de troca/gerenciamento de unidades.

### 1. Dados (insert direto, sem migration)
- `UPDATE clinics SET name='Barra da Tijuca' WHERE name='NOI Odonto'`
- `INSERT INTO clinics (name)` para "Ipanema" e "Recreio"
- Vincular o admin (`daniel@getbrain.com.br`) como **Administrador** nas 3 unidades via `clinic_members`, para que o switcher já apareça com as três opções e ele possa gerenciar todas.

### 2. Melhorias de UX no seletor (`ClinicSwitcher`)
Hoje o switcher já existe no topo do sidebar mas é simples. Vou deixar mais prático:
- Mostrar **badge com inicial** da unidade ativa (ex: "B", "I", "R") para identificação visual rápida.
- Ao trocar de clínica, exibir **toast** "Unidade alterada para Ipanema".
- Indicador visual claro de qual está ativa no dropdown (já existe check, vou reforçar com destaque de fundo).
- Ordenação alfabética garantida.

### 3. Header das páginas
Adicionar um pill discreto **"Unidade: {nome}"** no topo do `DashboardLayout` (uma vez só, ao invés de página por página) — assim o usuário sempre sabe em qual unidade está operando, em qualquer tela.

### 4. Aba "Clínicas" em Configurações
O `ClinicasPanel` já permite criar/editar/desativar. Vou validar que está acessível e prático para o admin criar futuras unidades sozinho (sem precisar pedir pra mim).

### Arquivos
- **Dados:** insert/update em `clinics` e `clinic_members`
- **Editados:** `src/components/ClinicSwitcher.tsx`, `src/components/DashboardLayout.tsx`
