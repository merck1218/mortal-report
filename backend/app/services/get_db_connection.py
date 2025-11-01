import psycopg2

def get_connection():
    return psycopg2.connect(
        dbname="mahjong",
        user="mahjong",
        password="Qazwsx4869",
        host="localhost",
        port="5432"
    )
