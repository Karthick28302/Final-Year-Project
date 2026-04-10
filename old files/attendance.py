from flask import Blueprint, jsonify
from database import get_db_connection

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/attendance', methods=['GET'])
def get_attendance():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
    SELECT users.name, attendance.login_time, attendance.logout_time
    FROM attendance
    JOIN users ON attendance.user_id = users.id
    ORDER BY attendance.login_time DESC
""")

    data = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(data)