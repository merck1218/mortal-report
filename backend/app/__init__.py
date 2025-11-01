from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config import Config

# DBインスタンスをグローバルに定義
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # 設定読み込み
    app.config.from_object(Config)

    # 拡張機能の初期化
    db.init_app(app)
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"))

    # Blueprintの登録
    from app.routes.order import order_bp
    from app.routes.reports import report_bp
    from app.routes.statistics import statistics_bp
    from app.routes.settings import settings_bp

    app.register_blueprint(order_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(statistics_bp)
    app.register_blueprint(settings_bp)

    return app
