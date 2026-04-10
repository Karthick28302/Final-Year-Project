from flask import Blueprint, send_file
import pandas as pd
from database import get_db_connection

export_bp = Blueprint("export", __name__)

@export_bp.route("/export", methods=["GET"])
def export_attendance():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT users.name, attendance.login_time, attendance.logout_time
        FROM attendance
        JOIN users ON users.id = attendance.user_id
        ORDER BY attendance.login_time DESC
    """)

    data = cursor.fetchall()

    cursor.close()
    connection.close()

    if not data:
        return {"message": "No data to export"}

    # Convert to DataFrame
    df = pd.DataFrame(data)

    file_path = "attendance.xlsx"
    df.to_excel(file_path, index=False)

    return send_file(file_path, as_attachment=True)