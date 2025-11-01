import datetime
from app.services import get_db_connection

def get_reports_function():
    # SQL文生成
    sql_text = f" \
        WITH ranked_players AS ( \
          SELECT \
            player_rank.game_id, \
            CASE rnk WHEN 1 THEN '1st_player' \
                     WHEN 2 THEN '2nd_player' \
                     WHEN 3 THEN '3rd_player' \
                     WHEN 4 THEN '4th_player' \
            END AS rank_label, \
            CASE player WHEN 'my' THEN '自分' \
                        WHEN 'shimocha' THEN '下家' \
                        WHEN 'toimen' THEN '対面' \
                        WHEN 'kamicha' THEN '上家' \
            END AS player_name, \
            score \
          FROM( \
            SELECT game_id, my_rank AS rnk, 'my' AS player, my_score AS score FROM statistics \
            UNION ALL \
            SELECT game_id, shimocha_rank, 'shimocha', shimocha_score FROM statistics \
            UNION ALL \
            SELECT game_id, toimen_rank, 'toimen', toimen_score FROM statistics \
            UNION ALL \
            SELECT game_id, kamicha_rank, 'kamicha', kamicha_score FROM statistics \
          ) AS player_rank \
        ), \
        pivoted AS ( \
          SELECT \
            game_id, \
            MAX(CASE WHEN rank_label = '1st_player' THEN player_name END) AS \"1st_player\", \
            MAX(CASE WHEN rank_label = '1st_player' THEN score END) AS \"1st_score\", \
            MAX(CASE WHEN rank_label = '2nd_player' THEN player_name END) AS \"2nd_player\", \
            MAX(CASE WHEN rank_label = '2nd_player' THEN score END) AS \"2nd_score\", \
            MAX(CASE WHEN rank_label = '3rd_player' THEN player_name END) AS \"3rd_player\", \
            MAX(CASE WHEN rank_label = '3rd_player' THEN score END) AS \"3rd_score\", \
            MAX(CASE WHEN rank_label = '4th_player' THEN player_name END) AS \"4th_player\", \
            MAX(CASE WHEN rank_label = '4th_player' THEN score END) AS \"4th_score\" \
          FROM ranked_players \
          GROUP BY game_id \
        ) \
        SELECT \
          p.game_id, \
          p.\"1st_player\", \
          p.\"1st_score\", \
          p.\"2nd_player\", \
          p.\"2nd_score\", \
          p.\"3rd_player\", \
          p.\"3rd_score\", \
          p.\"4th_player\", \
          p.\"4th_score\", \
          s.rating, \
          s.match_rate,\
          s.bad_rate, \
          s.my_rank, \
          r.game_date, \
          r.maka, \
          r.report_url \
        FROM pivoted p \
        JOIN statistics s ON p.game_id = s.game_id \
        JOIN reports r ON p.game_id = r.game_id \
        WHERE r.delete_flg = false \
        ORDER BY p.game_id DESC;"
    
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
            "game_id": row[0],
            "rank1_players": row[1],
            "rank1_score": row[2],
            "rank2_players": row[3],
            "rank2_score": row[4],
            "rank3_players": row[5],
            "rank3_score": row[6],
            "rank4_players": row[7],
            "rank4_score": row[8],
            "rating": f"{row[9] * 100:.1f}",
            "match_rate": f"{row[10] * 100:.1f}" if row[10] is not None else None,
            "bad_rate": f"{row[11] * 100:.1f}" if row[11] is not None else None,
            "my_rank": row[12],
            "game_date": row[13].strftime("%Y-%m-%d"),
            "maka": row[14],
            "report_url": row[15]
        })

    return {"reports": return_list}

def new_reports_function(game_id, report):
    # 変数宣言
    db_game_id = game_id
    db_maka = report[1]
    db_report_url = report[2]

    if report[0] == None or report[0] == "":
        str_date = datetime.date.today().strftime("%Y-%m-%d")
    else:
        str_date = str(report[0])

    db_game_date = datetime.datetime.strptime(str_date, '%Y-%m-%d').date()

    # SQL文生成
    sql_text = f" \
        INSERT INTO reports ( \
          game_id, \
          game_date, \
          maka, \
          report_url \
        ) \
        VALUES ( \
           {db_game_id}, \
          '{db_game_date}', \
          '{db_maka}', \
          '{db_report_url}' \
        )"
    
    # SQL実行処理
    conn = get_db_connection.get_connection()
    cur = conn.cursor()
    cur.execute(sql_text)
    conn.commit()
    cur.close
    conn.close