from flask import jsonify, request, Blueprint
from app.services import order

order_bp = Blueprint("order", __name__)

@order_bp.route('/order', methods=['POST'])
def new_order():
    new_order = request.get_json()
    message = order.new_order_function(new_order)

    return jsonify(message)