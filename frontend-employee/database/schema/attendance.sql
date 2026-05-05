CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  work_date DATE NOT NULL,
  login_time TIMESTAMP,
  logout_time TIMESTAMP,
  total_hours NUMERIC(5,2),
  status VARCHAR(20) DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
