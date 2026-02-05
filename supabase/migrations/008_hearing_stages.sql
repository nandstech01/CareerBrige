-- Hearing Stages Migration
-- Adds columns and statuses for 2-stage hearing workflow

-- Add new session statuses for the 2-stage hearing workflow
-- stage1_recording: Stage1録音中
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'stage1_recording';
-- stage1_complete: Stage1完了（志望動機完了）
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'stage1_complete';
-- stage2_recording: Stage2録音中
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'stage2_recording';
-- stage2_complete: Stage2完了（履歴書完成）
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'stage2_complete';

-- Add columns for 2-stage hearing data
ALTER TABLE monitor_sessions
  ADD COLUMN IF NOT EXISTS stage1_data JSONB,
  ADD COLUMN IF NOT EXISTS stage1_transcript TEXT,
  ADD COLUMN IF NOT EXISTS stage2_data JSONB,
  ADD COLUMN IF NOT EXISTS stage2_transcript TEXT,
  ADD COLUMN IF NOT EXISTS headshot_url TEXT,
  ADD COLUMN IF NOT EXISTS headshot_original_url TEXT,
  ADD COLUMN IF NOT EXISTS current_stage INT DEFAULT 1;

-- Comments for documentation
COMMENT ON COLUMN monitor_sessions.stage1_data IS 'Stage1 AI生成データ: 志望の動機, 本人希望記入欄, 自己PR';
COMMENT ON COLUMN monitor_sessions.stage1_transcript IS 'Stage1の音声文字起こし';
COMMENT ON COLUMN monitor_sessions.stage2_data IS 'Stage2 AI生成データ: 学歴, 職歴（日付計算済み）';
COMMENT ON COLUMN monitor_sessions.stage2_transcript IS 'Stage2の音声文字起こし';
COMMENT ON COLUMN monitor_sessions.headshot_url IS 'AI生成または加工済み証明写真URL';
COMMENT ON COLUMN monitor_sessions.headshot_original_url IS 'アップロードされた元の写真URL';
COMMENT ON COLUMN monitor_sessions.current_stage IS '現在のステージ (1 or 2)';

-- Create index for current_stage to optimize queries
CREATE INDEX IF NOT EXISTS idx_monitor_sessions_current_stage ON monitor_sessions(current_stage);
