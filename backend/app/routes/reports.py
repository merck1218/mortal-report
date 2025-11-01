from flask import jsonify, request, Blueprint
from app.services import reports

report_bp = Blueprint("report_list", __name__)

@report_bp.route('/report_list', methods=['GET'])
def get_reports():
    result = reports.get_reports_function()

    return jsonify(result)