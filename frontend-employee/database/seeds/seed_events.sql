-- Sample events and holidays seed data
INSERT INTO events (title, description, event_date, event_time, location)
VALUES
  ('Monthly Townhall', 'Company-wide monthly updates', CURRENT_DATE + 5, '16:00', 'Main Auditorium'),
  ('Team Outing', 'Outdoor team engagement activity', CURRENT_DATE + 12, '10:00', 'ECR Resort')
ON CONFLICT DO NOTHING;

INSERT INTO holidays (holiday_name, holiday_date, holiday_type)
VALUES
  ('Founders Day', CURRENT_DATE + 20, 'Company Holiday'),
  ('National Holiday', CURRENT_DATE + 35, 'Public Holiday')
ON CONFLICT DO NOTHING;
