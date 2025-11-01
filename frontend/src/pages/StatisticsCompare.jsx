import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StatisticsCompare.css";

function StatisticsCompare() {
  const [leftStats, setLeftStats] = useState(null);
  const [rightStats, setRightStats] = useState(null);
  const [loadingLeft, setLoadingLeft] = useState(true);
  const [loadingRight, setLoadingRight] = useState(true);

  const [leftMonth, setLeftMonth] = useState("");
  const [leftRank, setLeftRank] = useState("");
  const [leftMaka, setLeftMaka] = useState("");

  const [rightMonth, setRightMonth] = useState("");
  const [rightRank, setRightRank] = useState("");
  const [rightMaka, setRightMaka] = useState("");

  const monthOptions = (() => {
    const now = new Date();
    const options = [];
    for (let y = 2023; y <= now.getFullYear(); y++) {
      const maxMonth = y === now.getFullYear() ? now.getMonth() + 1 : 12;
      for (let m = 1; m <= maxMonth; m++) {
        options.push(`${y}-${String(m).padStart(2, "0")}`);
      }
    }
    return options.reverse();
  })();

  const fetchStats = async (side) => {
    const params = {
      month: side === "left" ? leftMonth : rightMonth,
      rank: side === "left" ? leftRank : rightRank,
      maka: side === "left" ? leftMaka : rightMaka,
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${API_BASE_URL}/api/statistics`, { params });
      if (side === "left") {
        setLeftStats(res.data);
      } else {
        setRightStats(res.data);
      }
    } catch (err) {
      console.error(`統計取得失敗 (${side}):`, err);
    } finally {
      if (side === "left") setLoadingLeft(false);
      else setLoadingRight(false);
    }
  };

  useEffect(() => {
    fetchStats("left");
  }, [leftMonth, leftRank, leftMaka]);

  useEffect(() => {
    fetchStats("right");
  }, [rightMonth, rightRank, rightMaka]);

  const renderStatsTable = (stats, loading) => (
    <table className="statistics-table">
      <tbody>
        {loading ? (
          <tr><td colSpan="2">読み込み中...</td></tr>
        ) : !stats ? (
          <tr><td colSpan="2">統計データが見つかりませんでした。</td></tr>
        ) : (
          <>
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
          </>
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      <main className="statistics-container">
        <div className="compare-grid">
          {/* 左側 */}
          <div className="compare-column">
            <h2>条件①</h2>
            <div className="filter-controls">
              <label>
                年月:
                <select value={leftMonth} onChange={(e) => setLeftMonth(e.target.value)}>
                  <option value="">すべて</option>
                  {monthOptions.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </label>
              <label>
                順位:
                <select value={leftRank} onChange={(e) => setLeftRank(e.target.value)}>
                  <option value="">すべて</option>
                  <option value="1">1位</option>
                  <option value="2">2位</option>
                  <option value="3">3位</option>
                  <option value="4">4位</option>
                </select>
              </label>
              <label>
                MAKA評価:
                <select value={leftMaka} onChange={(e) => setLeftMaka(e.target.value)}>
                  <option value="">すべて</option>
                  {["E", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </label>
            </div>
            {renderStatsTable(leftStats, loadingLeft)}
          </div>

          {/* 右側 */}
          <div className="compare-column">
            <h2>条件②</h2>
            <div className="filter-controls">
              <label>
                年月:
                <select value={rightMonth} onChange={(e) => setRightMonth(e.target.value)}>
                  <option value="">すべて</option>
                  {monthOptions.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </label>
              <label>
                順位:
                <select value={rightRank} onChange={(e) => setRightRank(e.target.value)}>
                  <option value="">すべて</option>
                  <option value="1">1位</option>
                  <option value="2">2位</option>
                  <option value="3">3位</option>
                  <option value="4">4位</option>
                </select>
              </label>
              <label>
                MAKA評価:
                <select value={rightMaka} onChange={(e) => setRightMaka(e.target.value)}>
                  <option value="">すべて</option>
                  {["E", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </label>
            </div>
            {renderStatsTable(rightStats, loadingRight)}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StatisticsCompare;
