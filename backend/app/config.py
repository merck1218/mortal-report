import os
from dotenv import load_dotenv

# .envファイルの読み込み（必要に応じて）
load_dotenv()

class Config:
    # Flask設定
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    # データベース設定（PostgreSQL推奨）
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # アプリ動作設定
    SERVER_HOST = os.getenv("SERVER_HOST")
    DST_PATH = os.getenv("DST_PATH")

    # その他のカスタム設定
    APP_NAME = "Mortal Report"
