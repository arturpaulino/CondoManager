# Sistema de Gestão de Condomínio (CondoManager)

Um sistema moderno e completo para gestão de condomínios, desenvolvido com as tecnologias mais recentes do ecossistema React.

![Dashboard Preview](https://placehold.co/1200x600/png?text=Preview+Dashboard)

## 🚀 Funcionalidades

O sistema possui os seguintes módulos integrados:

### 📊 Dashboard
- Visão geral das finanças do mês.
- Gráficos de receitas e despesas.
- Resumo de manutenções ativas.

### 👥 Moradores
- Cadastro completo de moradores (CRUD).
- Contato, unidade e status (ativo/inativo).
- Busca e filtragem rápida.

### 💰 Financeiro
- Gestão de contas a pagar e receber.
- Categorização de lançamentos.
- Extrato financeiro detalhado.
- Visualização gráfica do fluxo de caixa.

### 🔨 Manutenções
- Controle de manutenções preventivas e corretivas.
- Acompanhamento de status (Pendente, Em Andamento, Concluída).
- Registro de custos e data de agendamento.

### 🧾 Cobranças
- Geração de cobranças para moradores.
- Integração facilitada para cópia de dados de pagamento.
- Histórico de cobranças por unidade.

### 🚚 Fornecedores
- Cadastro de prestadores de serviço e fornecedores.
- Histórico de serviços prestados.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando:

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Backend / Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ instalado.
- Conta no Supabase (para o banco de dados).

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/app-condominio.git
   cd app-condominio
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configuração do Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Configuração do Banco de Dados**
   - Execute o script SQL localizado em `schema.sql` no Editor SQL do seu projeto Supabase para criar as tabelas e políticas de segurança (RLS) necessárias.

5. **Execute o projeto**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

---

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Cria a build de produção otimizada.
- `npm start`: Inicia o servidor de produção.
- `npm run lint`: Executa a verificação de código (ESLint).

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
