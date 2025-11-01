import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Statistics.css";

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [makaFilter, setMakaFilter] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(`${API_BASE_URL}/api/statistics`, {
          params: {
            month: monthFilter, // 例: "2024-10"
            rank: rankFilter,   // 例: "1"
            maka: makaFilter    // 例: "A+"
          }
        });
        setStats(res.data);
      } catch (err) {
        console.error("統計取得失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [monthFilter, rankFilter, makaFilter]);

  const monthOptions = (() => {
    const now = new Date();
    const options = [];
    for (let y = 2023; y <= now.getFullYear(); y++) {
      const maxMonth = y === now.getFullYear() ? now.getMonth() + 1 : 12;
      for (let m = 1; m <= maxMonth; m++) {
        options.push(`${y}-${String(m).padStart(2, "0")}`);
      }
    }
    return options.reverse(); // 新しい順
  })();

  return (
    <div>
      <main className="statistics-container">
        <div className="filter-controls">
          <label>
            年月:
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="">すべて</option>
              {monthOptions.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            順位:
            <select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)}>
              <option value="">すべて</option>
              <option value="1">1位</option>
              <option value="2">2位</option>
              <option value="3">3位</option>
              <option value="4">4位</option>
            </select>
          </label>
          <label>
            MAKA評価:
            <select value={makaFilter} onChange={(e) => setMakaFilter(e.target.value)}>
              <option value="">すべて</option>
              {["E", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : !stats ? (
          <p>統計データが見つかりませんでした。</p>
        ) : (
          <table className="statistics-table">
            <tbody>
              <tr><th>ゲーム数</th><td>{stats.game_count}</td></tr>
              <tr><th>平均レーティング</th><td>{stats.avg_rating}</td></tr>
              <tr><th>最大レーティング</th><td>{stats.max_rating}</td></tr>
              <tr><th>最小レーティング</th><td>{stats.min_rating}</td></tr>
              <tr><th>平均一致率</th><td>{stats.avg_match_rate}%</td></tr>
              <tr><th>最大一致率</th><td>{stats.max_match_rate}%</td></tr>
              <tr><th>最小一致率</th><td>{stats.min_match_rate}%</td></tr>
              <tr><th>平均悪手率</th><td>{stats.avg_bad_rate}%</td></tr>
              <tr><th>最大悪手率</th><td>{stats.max_bad_rate}%</td></tr>
              <tr><th>最小悪手率</th><td>{stats.min_bad_rate}%</td></tr>
              <tr><th>放銃時平均シャンテン数</th><td>{stats.avg_dealin_shanten}</td></tr>
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Statistics;
