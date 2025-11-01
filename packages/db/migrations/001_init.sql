create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  domain text,
  created_at timestamptz default now()
);

create table if not exists intents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  type text not null,                    -- createUser | disableUser | resetPassword | assignLicense | addToGroups ...
  input_json jsonb not null,             -- parsed from user natural language
  plan_json jsonb,                       -- structured execution plan (steps)
  status text not null default 'draft',  -- draft|planned|approved|applied|failed
  created_at timestamptz default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid references intents(id),
  approver text,
  status text not null default 'pending', -- pending|approved|rejected
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid references intents(id),
  step text,
  tool_name text,
  input_json jsonb,
  output_json jsonb,
  status text,
  ts timestamptz default now()
);

