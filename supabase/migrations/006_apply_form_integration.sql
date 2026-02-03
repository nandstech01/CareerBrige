-- Apply Form Integration Migration
-- Adds new status values for the LINE application flow

-- Add new session statuses for the apply form workflow
-- applied: 応募受付（初期状態）
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'applied';
-- scheduling: 日程調整中
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'scheduling';
-- interview_waiting: 面談待ち
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'interview_waiting';
-- interviewed: 面談済み
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'interviewed';
-- screening: 選考中
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'screening';
-- decided: 決定済み
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'decided';
-- dropped: 離脱（応募フロー用）
ALTER TYPE monitor_session_status ADD VALUE IF NOT EXISTS 'dropped';

-- source column is TEXT, so 'apply_form' can be inserted without schema changes.
-- basic_info JSONB will store apply form fields (name, age, gender, prefecture,
-- canRelocate, hasResume, jobTemperature, lineId, admin_notes) without schema changes.
