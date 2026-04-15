from backend.app.database.db_connection import get_db_connection


def get_all_attendance():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT users.name, attendance.id,
               attendance.login_time, attendance.logout_time
        FROM attendance
        JOIN users ON attendance.user_id = users.id
        ORDER BY attendance.login_time DESC
    """)
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results


def get_attendance_by_date(from_date: str, to_date: str):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT users.name, attendance.id,
               attendance.login_time, attendance.logout_time
        FROM attendance
        JOIN users ON attendance.user_id = users.id
        WHERE DATE(attendance.login_time) BETWEEN %s AND %s
        ORDER BY attendance.login_time DESC
    """, (from_date, to_date))
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results


def get_today_record(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT * FROM attendance WHERE user_id = %s AND DATE(login_time) = CURDATE()",
        (user_id,)
    )
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def create_login(user_id: int, login_time):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO attendance (user_id, login_time) VALUES (%s, %s)",
        (user_id, login_time)
    )
    conn.commit()
    cur.close()
    conn.close()


def update_logout(attendance_id: int, logout_time):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE attendance SET logout_time = %s WHERE id = %s",
        (logout_time, attendance_id)
    )
    conn.commit()
    cur.close()
    conn.close()


def get_open_session(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT id FROM attendance
        WHERE user_id = %s AND logout_time IS NULL
        ORDER BY login_time DESC
        LIMIT 1
    """, (user_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def get_stats_today():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT COUNT(*) AS total_today,
               SUM(logout_time IS NULL) AS currently_present
        FROM attendance
        WHERE DATE(login_time) = CURDATE()
    """)
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result

def get_user_attendance_summary(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        """
        SELECT
            COUNT(*) AS total_records,
            SUM(DATE(login_time) = CURDATE()) AS today_records,
            SUM(logout_time IS NULL) AS currently_present
        FROM attendance
        WHERE user_id = %s
        """,
        (user_id,),
    )
    summary = cur.fetchone()
    cur.close()
    conn.close()
    return summary
