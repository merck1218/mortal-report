from flask import Flask, jsonify, request, Blueprint
from app.services import settings

settings_bp = Blueprint("settings", __name__)

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    result = settings.get_settings_function()

    return jsonify(result)

@settings_bp.route('/settings/<int:setting_id>', methods=['PUT'])
def update_setting(setting_id):
    data = request.get_json()
    new_value = data.get("value")

    if new_value is None:
        return jsonify({"error": "値が指定されていません"}), 400

    try:
        # 設定を更新するサービス関数を呼び出す
        updated = settings.update_settings_function(setting_id, new_value)

        if updated:
            return jsonify({"message": "設定が更新されました"}), 200
        else:
            return jsonify({"error": "指定された設定が見つかりません"}), 404

    except Exception as e:
        print("更新エラー:", e)
        return jsonify({"error": "設定の更新に失敗しました"}), 500
