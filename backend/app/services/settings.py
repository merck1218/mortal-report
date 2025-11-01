from app.services import get_db_connection

def get_settings_function():
    # SQLクエリ作成
    sql_text = "SELECT id, item, explain, value FROM settings;"

    # SQL実行処理
    conn = get_db_connection.get_connection()
    cur = conn.cursor()
    cur.execute(sql_text)
    rows = cur.fetchall()
    cur.close
    conn.close

    # 変数に格納
    return_list = []
    for row in rows:
        return_list.append({
            "id": row[0],
            "item": row[1],
            "explain": row[2],
            "value": row[3]
        })
    
    return {"settings": return_list}

def update_settings_function(id, value):
    # SQLクエリ作成
    sql_text = "UPDATE settings SET value = %s WHERE id = %s;" % (repr(value), repr(id))

    # SQL実行処理
    conn = get_db_connection.get_connection()
    cur = conn.cursor()
    cur.execute(sql_text)
    conn.commit()
    cur.close
    conn.close

    return True