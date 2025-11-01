from flask import jsonify, request, Blueprint
from app.services import statistics

statistics_bp = Blueprint("statistics", __name__)

@statistics_bp.route('/statistics', methods=['GET'])
def get_statistics():
    # クエリパラメータ処理
    query_month = request.args.get('month')
    query_rank = request.args.get('rank')
    query_maka = request.args.get('maka')
    result = statistics.get_statistics_function(query_month, query_rank, query_maka)

    return jsonify(result)