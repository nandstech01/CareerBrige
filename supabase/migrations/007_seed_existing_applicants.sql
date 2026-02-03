-- Seed existing LINE applicants from spreadsheet
-- These are the 6 applicants already tracked in the GAS spreadsheet

-- 1. 脇阪祐士 - 面談済み, メモ: ※決定したら支払い
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'interviewed',
  0,
  '{"name": "脇阪祐士", "age": "28", "gender": "男性", "prefecture": "大阪府", "canRelocate": false, "hasResume": false, "jobTemperature": "", "lineId": "", "admin_notes": "※決定したら支払い"}'::jsonb,
  '2026-01-27 00:00:00+09'
);

-- 2. 八島綾乃 - 面談済み
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'interviewed',
  0,
  '{"name": "八島綾乃", "age": "33", "gender": "女性", "prefecture": "愛知県", "canRelocate": false, "hasResume": false, "jobTemperature": "良い求人があれば", "lineId": "", "admin_notes": ""}'::jsonb,
  '2026-01-28 13:07:44+09'
);

-- 3. 吉田愛世 - 面談待ち, メモ: ※決定したら支払い
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'interview_waiting',
  0,
  '{"name": "吉田愛世", "age": "18", "gender": "女性", "prefecture": "兵庫県", "canRelocate": false, "hasResume": false, "jobTemperature": "情報収集中", "lineId": "", "admin_notes": "※決定したら支払い"}'::jsonb,
  '2026-01-28 13:57:04+09'
);

-- 4. みさきまりあ - 面談待ち
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'interview_waiting',
  0,
  '{"name": "みさきまりあ", "age": "23", "gender": "女性", "prefecture": "三重県", "canRelocate": true, "hasResume": false, "jobTemperature": "情報収集中", "lineId": "", "admin_notes": ""}'::jsonb,
  '2026-01-28 18:53:22+09'
);

-- 5. 北島勇太 - 応募受付, LINE ID: yutanzzz
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'applied',
  0,
  '{"name": "北島勇太", "age": "32", "gender": "男性", "prefecture": "和歌山県", "canRelocate": false, "hasResume": true, "jobTemperature": "良い求人があれば", "lineId": "yutanzzz", "admin_notes": ""}'::jsonb,
  '2026-01-29 11:40:03+09'
);

-- 6. 黒滝匡 - 応募受付
INSERT INTO monitor_sessions (
  session_token, source, status, step_reached, basic_info, started_at
) VALUES (
  gen_random_uuid()::text,
  'apply_form',
  'applied',
  0,
  '{"name": "黒滝匡", "age": "23", "gender": "男性", "prefecture": "青森県", "canRelocate": false, "hasResume": false, "jobTemperature": "", "lineId": "", "admin_notes": ""}'::jsonb,
  '2026-01-30 13:31:13+09'
);
