---
description: Verification steps to validate the Condominium Management System functionality.
---

# System Verification Workflow

Use this workflow to validate that all modules of the CondoManager system are working correctly.

## 1. Environment Check
Check if the project is running and database is connected.
1. Ensure the development server is running:
   ```powershell
   # If not already running
   npm run dev
   ```
2. Verify Supabase connection by accessing the application at `http://localhost:3000`.

## 2. Module Verification Steps
Follow these steps to test each feature. All actions are performed in the browser.

### Authentication
- [ ] Login with valid credentials.
- [ ] Verify you are redirected to the Dashboard.

### Dashboard
- [ ] Check if "Contas do Mês" shows a numeric value.
- [ ] Verify the "Gráfico Financeiro" is visible and not empty (create a payment if needed).

### Fornecedores (Suppliers)
- [ ] Navigate to **Fornecedores**.
- [ ] Click **Novo Fornecedor**.
- [ ] Create a supplier named "Test Supplier".
- [ ] Edit the supplier and change name to "Test Supplier Edited".
- [ ] Delete the supplier.

### Moradores (Residents)
- [ ] Navigate to **Moradores**.
- [ ] Click **Novo Morador**.
- [ ] Create a resident:
  - Nome: "Morador Teste"
  - Unidade: "101"
  - Email: "teste@email.com"
- [ ] Edit and change status to "Inativo".
- [ ] Delete the resident.

### Financeiro (Payments)
- [ ] Navigate to **Financeiro**.
- [ ] Click **Novo Lançamento**.
- [ ] Create a payment:
  - Descrição: "Teste Pagamento"
  - Valor: 100.00
  - Vencimento: Today
- [ ] Verify it appears in the Dashboard graph.

### Cobranças (Billing) - **NEW**
- [ ] Navigate to **Cobranças**.
- [ ] Click **Nova Cobrança**.
- [ ] Select a resident and create a charge of R$ 500,00.
- [ ] Click the **Copy** icon on the list and verify the clipboard text.

### Manutenções
- [ ] Navigate to **Manutenções**.
- [ ] Create a maintenance task titled "Teste Manutenção".
- [ ] Verify it appears in the Dashboard "Manutenções Ativas".

## 3. Deployment Preparation
If all tests pass:
1. Run build verification:
   ```powershell
   npm run build
   ```
2. Check for type errors or lint warnings.
