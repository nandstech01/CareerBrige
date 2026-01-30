-- Monitor Program Schema Migration
-- Adds tables for the resume creation monitor program feature

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE monitor_role AS ENUM ('owner', 'admin', 'staff', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monitor_session_status AS ENUM (
    'started', 'basic_info', 'recording', 'transcribing',
    'generating', 'reviewing', 'completed', 'abandoned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Workspaces (company tenants)
CREATE TABLE IF NOT EXISTS monitor_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  max_admin_accounts INT NOT NULL DEFAULT 3,
  max_general_accounts INT NOT NULL DEFAULT 30,
  max_api_calls_monthly INT NOT NULL DEFAULT 200000,
  max_storage_bytes BIGINT NOT NULL DEFAULT 53687091200, -- 50GB
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workspace members
CREATE TABLE IF NOT EXISTS monitor_workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES monitor_workspaces(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  monitor_role monitor_role NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_monitor_members_workspace ON monitor_workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_monitor_members_profile ON monitor_workspace_members(profile_id);

-- Templates (must be created before sessions which reference it)
CREATE TABLE IF NOT EXISTS monitor_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES monitor_workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL DEFAULT 'resume',
  template_data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_monitor_templates_workspace ON monitor_templates(workspace_id);

-- Sessions (resume creation sessions)
CREATE TABLE IF NOT EXISTS monitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES monitor_workspaces(id) ON DELETE SET NULL,
  created_by_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_token TEXT NOT NULL UNIQUE,
  status monitor_session_status NOT NULL DEFAULT 'started',
  source TEXT NOT NULL DEFAULT 'public',
  basic_info JSONB,
  transcript TEXT,
  resume_data JSONB,
  template_id UUID REFERENCES monitor_templates(id) ON DELETE SET NULL,
  step_reached INT NOT NULL DEFAULT 1,
  ai_calls_count INT NOT NULL DEFAULT 0,
  pdf_downloaded BOOLEAN NOT NULL DEFAULT FALSE,
  consent_given_at TIMESTAMPTZ,
  consent_version TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_monitor_sessions_workspace ON monitor_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_monitor_sessions_token ON monitor_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_monitor_sessions_status ON monitor_sessions(status);
CREATE INDEX IF NOT EXISTS idx_monitor_sessions_created_by ON monitor_sessions(created_by_profile_id);
CREATE INDEX IF NOT EXISTS idx_monitor_sessions_started_at ON monitor_sessions(started_at);

-- Operation logs
CREATE TABLE IF NOT EXISTS monitor_operation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES monitor_workspaces(id) ON DELETE SET NULL,
  actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id UUID REFERENCES monitor_sessions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_monitor_logs_workspace ON monitor_operation_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_monitor_logs_session ON monitor_operation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_monitor_logs_created_at ON monitor_operation_logs(created_at);

-- Consent records
CREATE TABLE IF NOT EXISTS monitor_consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES monitor_sessions(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_token TEXT,
  consent_type TEXT NOT NULL,
  consented BOOLEAN NOT NULL,
  consent_version TEXT NOT NULL,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_monitor_consent_session ON monitor_consent_records(session_id);

-- ============================================================
-- TRIGGERS (updated_at)
-- ============================================================

DO $$ BEGIN
  CREATE TRIGGER trg_monitor_workspaces_updated_at
  BEFORE UPDATE ON monitor_workspaces FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_monitor_templates_updated_at
  BEFORE UPDATE ON monitor_templates FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_monitor_sessions_updated_at
  BEFORE UPDATE ON monitor_sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE monitor_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_consent_records ENABLE ROW LEVEL SECURITY;

-- Workspace policies: members can read their workspace
CREATE POLICY monitor_workspaces_select ON monitor_workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid() AND is_active = TRUE
    )
  );

-- Workspace members: can read members of their workspace
CREATE POLICY monitor_members_select ON monitor_workspace_members
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid() AND is_active = TRUE
    )
  );

-- Owner/admin can manage members
CREATE POLICY monitor_members_insert ON monitor_workspace_members
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid()
        AND is_active = TRUE
        AND monitor_role IN ('owner', 'admin')
    )
  );

CREATE POLICY monitor_members_update ON monitor_workspace_members
  FOR UPDATE USING (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid()
        AND is_active = TRUE
        AND monitor_role IN ('owner', 'admin')
    )
  );

-- Templates: workspace members can read, staff+ can manage
CREATE POLICY monitor_templates_select ON monitor_templates
  FOR SELECT USING (
    workspace_id IS NULL  -- system templates are public
    OR workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid() AND is_active = TRUE
    )
  );

CREATE POLICY monitor_templates_insert ON monitor_templates
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid()
        AND is_active = TRUE
        AND monitor_role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY monitor_templates_update ON monitor_templates
  FOR UPDATE USING (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid()
        AND is_active = TRUE
        AND monitor_role IN ('owner', 'admin', 'staff')
    )
  );

-- Sessions: public sessions are accessible via service role only.
-- Authenticated workspace members can see their workspace sessions.
CREATE POLICY monitor_sessions_select ON monitor_sessions
  FOR SELECT USING (
    created_by_profile_id = auth.uid()
    OR workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid() AND is_active = TRUE
    )
  );

CREATE POLICY monitor_sessions_insert ON monitor_sessions
  FOR INSERT WITH CHECK (TRUE);  -- Public users create via service role

CREATE POLICY monitor_sessions_update ON monitor_sessions
  FOR UPDATE USING (
    created_by_profile_id = auth.uid()
    OR workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid()
        AND is_active = TRUE
        AND monitor_role IN ('owner', 'admin', 'staff')
    )
  );

-- Operation logs: workspace members can read
CREATE POLICY monitor_logs_select ON monitor_operation_logs
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM monitor_workspace_members
      WHERE profile_id = auth.uid() AND is_active = TRUE
    )
  );

CREATE POLICY monitor_logs_insert ON monitor_operation_logs
  FOR INSERT WITH CHECK (TRUE);  -- Service role inserts

-- Consent records: own or workspace access
CREATE POLICY monitor_consent_select ON monitor_consent_records
  FOR SELECT USING (
    profile_id = auth.uid()
    OR session_id IN (
      SELECT id FROM monitor_sessions
      WHERE workspace_id IN (
        SELECT workspace_id FROM monitor_workspace_members
        WHERE profile_id = auth.uid() AND is_active = TRUE
      )
    )
  );

CREATE POLICY monitor_consent_insert ON monitor_consent_records
  FOR INSERT WITH CHECK (TRUE);  -- Service role inserts

-- ============================================================
-- SEED: Youtopia workspace
-- ============================================================

INSERT INTO monitor_workspaces (company_name, slug, settings)
VALUES (
  'Youtopia',
  'youtopia',
  '{"plan": "enterprise", "features": ["hearing", "templates", "analytics"]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
