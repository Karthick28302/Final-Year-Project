from flask import Blueprint, request, jsonify, send_file
from io import BytesIO
import pandas as pd

from backend.app.models.attendance_model import get_all_attendance, get_attendance_by_date
from backend.app.services.attendance_service import calculate_duration

report_bp = Blueprint("reports", __name__)


@report_bp.route("/export", methods=["GET"])
def export_attendance():
    from_date = request.args.get("from")
    to_date = request.args.get("to")

    if from_date and to_date:
        records = get_attendance_by_date(from_date, to_date)
    else:
        records = get_all_attendance()

    if not records:
        return jsonify({"message": "No data to export"}), 404

    for record in records:
        record["duration"] = calculate_duration(record["login_time"], record["logout_time"])
        record["login_time"] = record["login_time"].isoformat() if record["login_time"] else None
        record["logout_time"] = record["logout_time"].isoformat() if record["logout_time"] else None

    df = pd.DataFrame(records)
    df.drop(columns=["id"], errors="ignore", inplace=True)

    output = BytesIO()
    df.to_excel(output, index=False)
    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="attendance.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
