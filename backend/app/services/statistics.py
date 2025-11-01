import calendar
from app.services import get_db_connection

def get_statistics_function(query_month, query_rank, query_maka):
    # 変数処理 & WHERE句生成
    if query_month != "":
        year = query_month.split("-")[0]
        month = query_month.split("-")[1]
        last_day = calendar.monthrange(int(year), int(month))[1]
        start_date = f"{year}-{month}-01"
        end_date = f"{year}-{month}-{last_day}"
        sql_text_date = f"reports.game_date BETWEEN '{start_date}' AND '{end_date}'"
    else:
        sql_text_date = "1 = 1"
    
    if query_rank != "":
        rank = int(query_rank)
        sql_text_rank = f"statistics.my_rank = '{rank}'"
    else:
        sql_text_rank = "1 = 1"

    if query_maka != "":
        sql_text_maka = f"reports.maka = '{query_maka}'"
    else:
        sql_text_maka = "1 = 1" 

    # 統計情報取得SQL
    sql_text = f" \
        SELECT \
          AVG(statistics.rating) as avg_rating, \
          MAX(statistics.rating) as max_rating, \
          MIN(statistics.rating) as min_rating, \
          AVG(statistics.match_rate) as avg_match_rate, \
          MAX(statistics.match_rate) as max_match_rate, \
          MIN(statistics.match_rate) as min_match_rate, \
          AVG(statistics.bad_rate) as avg_bad_rate, \
          MAX(statistics.bad_rate) as max_bad_rate, \
          MIN(statistics.bad_rate) as min_bad_rate, \
          CAST(SUM(statistics.dealin_shanten) AS REAL) / SUM(statistics.dealin_count) as avg_dealin_shanten, \
          COUNT(*) \
        FROM \
          reports \
        LEFT JOIN \
          statistics \
        ON \
          reports.game_id = statistics.game_id \
        WHERE \
          {sql_text_date} AND \
          {sql_text_rank} AND \
          {sql_text_maka} AND \
          reports.delete_flg = false"
    
    # SQL実行処理
    conn = get_db_connection.get_connection()
    cur = conn.cursor()
    cur.execute(sql_text)
    rows = cur.fetchall()
    cur.close
    conn.close

    # 変数に格納  
    return_dict = {}
    for row in rows:
        return_dict = {
            "avg_rating": f"{row[0] * 100:.1f}" if row[0] is not None else None,
            "max_rating": f"{row[1] * 100:.1f}" if row[1] is not None else None,
            "min_rating": f"{row[2] * 100:.1f}" if row[2] is not None else None,
            "avg_match_rate": f"{row[3] * 100:.1f}" if row[3] is not None else None,
            "max_match_rate": f"{row[4] * 100:.1f}" if row[4] is not None else None,
            "min_match_rate": f"{row[5] * 100:.1f}" if row[5] is not None else None,
            "avg_bad_rate": f"{row[6] * 100:.1f}" if row[6] is not None else None,
            "max_bad_rate": f"{row[7] * 100:.1f}" if row[7] is not None else None,
            "min_bad_rate": f"{row[8] * 100:.1f}" if row[8] is not None else None,
            "avg_dealin_shanten": f"{row[9]:.2f}" if row[9] is not None else None,
            "game_count": row[10]
        }
    
    return return_dict

def new_statistics_function(game_id, statistics):
    # 変数宣言
    db_game_id = game_id
    db_my_score = statistics[0]
    db_my_rank = statistics[1]
    db_shimocha_score = statistics[2]
    db_shimocha_rank = statistics[3]
    db_toimen_score = statistics[4]
    db_toimen_rank = statistics[5]
    db_kamicha_score = statistics[6]
    db_kamicha_rank = statistics[7]
    db_rating = statistics[8]
    db_total_reviewed = statistics[9]
    db_total_matches = statistics[10]
    db_total_bad = statistics[11]
    db_match_rate = statistics[12]
    db_bad_rate = statistics[13]
    db_dealin_count = statistics[14]
    db_dealin_shanten = statistics[15]

    # SQL文生成
    sql_text = f" \
        INSERT INTO statistics (\
          game_id, \
          my_score, \
          my_rank, \
          shimocha_score, \
          shimocha_rank, \
          toimen_score, \
          toimen_rank, \
          kamicha_score, \
          kamicha_rank, \
          rating, \
          total_reviewed, \
          total_matches, \
          total_bad, \
          match_rate, \
          bad_rate, \
          dealin_count, \
          dealin_shanten \
        ) \
        VALUES ( \
          {db_game_id}, \
          {db_my_score}, \
          {db_my_rank}, \
          {db_shimocha_score}, \
          {db_shimocha_rank}, \
          {db_toimen_score}, \
          {db_toimen_rank}, \
          {db_kamicha_score}, \
          {db_kamicha_rank}, \
          {db_rating}, \
          {db_total_reviewed}, \
          {db_total_matches}, \
          {db_total_bad}, \
          {db_match_rate}, \
          {db_bad_rate}, \
          {db_dealin_count}, \
          {db_dealin_shanten} \
        )"
    
    # SQL実行処理
    conn = get_db_connection.get_connection()
    cur = conn.cursor()
    cur.execute(sql_text)
    conn.commit()
    cur.close
    conn.close