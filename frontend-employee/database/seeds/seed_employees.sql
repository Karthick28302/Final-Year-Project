-- Sample employee seed data (non-admin)
INSERT INTO users (employee_code, full_name, email, password_hash, role, status)
VALUES
  ('EMP1001', 'Arun Kumar', 'arun.kumar@company.com', '$2a$10$qobi9rAO2MSnmvKA4gyXWeCJsfn5ictKoeTHY8XYyHpk7IoIdo9yO', 'employee', 'active'),
  ('EMP1002', 'Nisha Sharma', 'nisha.sharma@company.com', '$2a$10$qobi9rAO2MSnmvKA4gyXWeCJsfn5ictKoeTHY8XYyHpk7IoIdo9yO', 'employee', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employee_profiles (user_id, department, designation, join_date, phone, address)
SELECT id, 'Engineering', 'Software Engineer', '2024-01-15', '9876543210', 'Chennai, Tamil Nadu'
FROM users
WHERE employee_code = 'EMP1001'
AND NOT EXISTS (SELECT 1 FROM employee_profiles ep WHERE ep.user_id = users.id);

INSERT INTO employee_profiles (user_id, department, designation, join_date, phone, address)
SELECT id, 'HR', 'HR Executive', '2023-09-10', '9876501234', 'Bengaluru, Karnataka'
FROM users
WHERE employee_code = 'EMP1002'
AND NOT EXISTS (SELECT 1 FROM employee_profiles ep WHERE ep.user_id = users.id);

INSERT INTO attendance (user_id, work_date, login_time, logout_time, total_hours, status)
SELECT u.id, CURRENT_DATE - 2, CURRENT_DATE - 2 + TIME '09:05', CURRENT_DATE - 2 + TIME '18:10', 9.08, 'present'
FROM users u
WHERE u.employee_code = 'EMP1001'
AND NOT EXISTS (
  SELECT 1 FROM attendance a WHERE a.user_id = u.id AND a.work_date = CURRENT_DATE - 2
);

INSERT INTO attendance (user_id, work_date, login_time, logout_time, total_hours, status)
SELECT u.id, CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '09:15', CURRENT_DATE - 1 + TIME '17:55', 8.67, 'present'
FROM users u
WHERE u.employee_code = 'EMP1001'
AND NOT EXISTS (
  SELECT 1 FROM attendance a WHERE a.user_id = u.id AND a.work_date = CURRENT_DATE - 1
);

INSERT INTO salaries (user_id, month, year, basic_salary, allowances, deductions, net_salary, paid_on)
SELECT u.id, EXTRACT(MONTH FROM CURRENT_DATE)::int, EXTRACT(YEAR FROM CURRENT_DATE)::int, 40000, 5000, 1500, 43500, CURRENT_DATE
FROM users u
WHERE u.employee_code = 'EMP1001'
AND NOT EXISTS (
  SELECT 1 FROM salaries s
  WHERE s.user_id = u.id
    AND s.month = EXTRACT(MONTH FROM CURRENT_DATE)::int
    AND s.year = EXTRACT(YEAR FROM CURRENT_DATE)::int
);
