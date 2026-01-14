-- ==============================================================================
-- Schema for Condominium Management System (Supabase/PostgreSQL)
-- Modules: Suppliers, Finance (Payable), Maintenance, Residents, Billing (Receivable)
-- Updated: 2026-01-13 (Cobrancas Added)
-- ==============================================================================

-- 1. Extensions and Utilities
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 2. Module 1: Fornecedores (Suppliers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.fornecedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    tipo_servico TEXT,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    documento TEXT, -- CPF or CNPJ
    status TEXT CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Either phone or email must be provided
    CONSTRAINT check_contact_info CHECK (telefone IS NOT NULL OR email IS NOT NULL)
);

-- Trigger for updated_at
CREATE TRIGGER update_fornecedores_updated_at
    BEFORE UPDATE ON public.fornecedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. Module 2: Financeiro (Despesas/Pagamentos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE RESTRICT,
    descricao TEXT,
    valor NUMERIC NOT NULL CHECK (valor > 0),
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')) DEFAULT 'pendente',
    forma_pagamento TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraint: Payment date only if status is 'pago'
    CONSTRAINT check_payment_date CHECK (
        (status = 'pago' AND data_pagamento IS NOT NULL) OR 
        (status != 'pago' AND data_pagamento IS NULL)
    ),

    CONSTRAINT fk_fornecedor_exists FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id)
);

-- Trigger for updated_at
CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON public.pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. Module 3: Manutenções (Maintenance)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.manutencoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE RESTRICT,
    descricao TEXT,
    tipo TEXT, 
    local TEXT,
    data_execucao DATE,
    data_validade DATE,
    data_agendada DATE,
    custo_estimado NUMERIC(10,2),
    status TEXT CHECK (status IN ('pendente', 'agendado', 'em_andamento', 'concluido', 'cancelado', 'ativa', 'vencida')) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER update_manutencoes_updated_at
    BEFORE UPDATE ON public.manutencoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. Module 4: Moradores (Residents)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.moradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT,
  email TEXT,
  telefone TEXT,
  unidade TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.moradores ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6. Module 5: Cobranças (Receitas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cobrancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  morador_id UUID REFERENCES moradores(id) ON DELETE RESTRICT,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL CHECK (valor > 0),
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')) DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- ==============================================================================
CREATE POLICY "Allow all for authenticated users" ON public.fornecedores FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.pagamentos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON public.manutencoes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.moradores FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.cobrancas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- End of Schema
-- ==============================================================================
