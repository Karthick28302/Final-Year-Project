CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  month INT NOT NULL,
  year INT NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL,
  allowances NUMERIC(12,2) DEFAULT 0,
  deductions NUMERIC(12,2) DEFAULT 0,
  net_salary NUMERIC(12,2) NOT NULL,
  paid_on DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
