import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./ReportList.css";
import filter_img from "../assets/filter.png"

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortKey, setSortKey] = useState("game_date");
  const [sortOrder, setSortOrder] = useState("desc");

  // 絞り込みステート
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterRank, setFilterRank] = useState("");
  const [filterMaka, setFilterMaka] = useState("");
  const [filterRatingMin, setFilterRatingMin] = useState("");
  const [filterRatingMax, setFilterRatingMax] = useState("");

  const isFilterActive =
  filterRank !== "" || filterMaka !== "" || filterRatingMin !== "" || filterRatingMax !== "";
  
  // フィルターをリセットする関数
  const resetFilters = () => {
    setFilterRank("");
    setFilterMaka("");
    setFilterRatingMin("");
    setFilterRatingMax("");
  };

  const now = new Date();
  const isAtLatestMonth =
    currentDate.getFullYear() === now.getFullYear() &&
    currentDate.getMonth() === now.getMonth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(`${API_BASE_URL}/api/report_list`);
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("取得失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getMonthLabel = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const handleDropdownChange = (e) => {
    const [y, m] = e.target.value.split("-");
    const newDate = new Date(parseInt(y), parseInt(m) - 1);
    setCurrentDate(newDate);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const getSortIndicator = (key) => {
    if (sortKey !== key) return ""; // 並び替え可能な印
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let y = 2023; y <= currentYear; y++) {
      const maxMonth = y === currentYear ? currentMonth : 12;
      for (let m = 1; m <= maxMonth; m++) {
        const label = `${y}-${String(m).padStart(2, "0")}`;
        options.push(label);
      }
    }

    return options;
  };

  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.game_date);
    const matchesMonth =
      reportDate.getFullYear() === currentDate.getFullYear() &&
      reportDate.getMonth() === currentDate.getMonth();

    const matchesRank =
      filterRank === "" || report.my_rank === parseInt(filterRank);

    const matchesMaka =
      filterMaka === "" || report.maka === filterMaka;

    const rating = parseFloat(report.rating);

    const matchesRatingMin =
      filterRatingMin === "" || (rating != null && rating >= parseFloat(filterRatingMin));
      
    const matchesRatingMax =
      filterRatingMax === "" || (rating != null && rating <= parseFloat(filterRatingMax));

    return matchesMonth && matchesRank && matchesMaka && matchesRatingMin && matchesRatingMax;
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortKey === "game_date") {
      return sortOrder === "asc"
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    }

    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }

    return 0;
  });

  return (
    <div>
      <Header />
      <main className="report-list-container">
        <h1>解析レポート一覧</h1>

        <div className="month-controls">
          <button onClick={handlePrevMonth}>← 前月</button>
          <select value={getMonthLabel(currentDate)} onChange={handleDropdownChange}>
            {generateMonthOptions().map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          <button onClick={handleNextMonth} disabled={isAtLatestMonth}>
            翌月 →
          </button>
        </div>

        <div className="report-actions">
          <p className="report-count">
            表示中のレポート件数: {filteredReports.length} 件
          </p>
          
          <div className={`filter-toggle-wrapper ${filterDialogOpen || isFilterActive ? "active" : ""}`}>
            <img src={filter_img} alt="Filter" className="filter-icon" />
            <a
              href="#"
              className="filter-toggle-link"
              onClick={(e) => {
                e.preventDefault();
                setFilterDialogOpen(true);
              }}
            >
              フィルター
            </a>
            
            {isFilterActive && (
              <>
                <span className="filter-divider" />
                <a
                  href="#"
                  className="filter-clear-link"
                  onClick={(e) => {
                    e.preventDefault();
                    resetFilters();
                  }}
                >
                  ✖
                </a>
              </>
            )}
          </div>
        </div>

        {filterDialogOpen && (
          <div className="filter-dialog">
            <h3>絞り込み条件</h3>

            <fieldset className="filter-rank-group">
              <legend><h4>順位:</h4></legend>
              <div className="rank-options">
                {["", "1", "2", "3", "4"].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="rank"
                      value={value}
                      checked={filterRank === value}
                      onChange={(e) => setFilterRank(e.target.value)}
                    />
                    {value === "" ? "全部" : `${value}位`}
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              <h4>MAKA評価:</h4>
              <div className="filter-maka">
                <select value={filterMaka} onChange={(e) => setFilterMaka(e.target.value)}>
                  <option value="">全部</option>
                  <option value="E">E</option>
                  <option value="D">D</option>
                  <option value="C-">C-</option>
                  <option value="C">C</option>
                  <option value="C+">C+</option>
                  <option value="B-">B-</option>
                  <option value="B">B</option>
                  <option value="B+">B+</option>
                  <option value="A-">A-</option>
                  <option value="A">A</option>
                  <option value="A+">A+</option>
                  <option value="S-">S-</option>
                  <option value="S">S</option>
                  <option value="S+">S+</option>
                </select>
              </div>
            </label>

            <label>
              <h4>レーティング:</h4>
              <div className="filter-rating">
                <input type="number" className="filter-rating-min" value={filterRatingMin} onChange={(e) => setFilterRatingMin(e.target.value)} />
                ～
                <input type="number" className="filter-rating-max" value={filterRatingMax} onChange={(e) => setFilterRatingMax(e.target.value)} />
              </div>
            </label>

            <a
              href="#"
              className="filter-close-link"
              onClick={(e) => {
                e.preventDefault();
                setFilterDialogOpen(false);
              }}
            >
              ✔
            </a>
          </div>
        )}

        <table className="report-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("game_date")}>
                対局日付 {getSortIndicator("game_date")}
              </th>
              <th className="sortable" onClick={() => handleSort("my_rank")}>
                順位 {getSortIndicator("my_rank")}
              </th>
              <th>1位</th>
              <th>2位</th>
              <th>3位</th>
              <th>4位</th>
              <th className="sortable" onClick={() => handleSort("rating")}>
                レーティング {getSortIndicator("rating")}
              </th>
              <th className="sortable" onClick={() => handleSort("match_rate")}>
                一致率 {getSortIndicator("match_rate")}
              </th>
              <th className="sortable" onClick={() => handleSort("bad_rate")}>
                悪手率 {getSortIndicator("bad_rate")}
              </th>
              <th>MAKA評価</th>
              <th>解析レポートURL</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="11">読み込み中...</td></tr>
            ) : sortedReports.length === 0 ? (
              <tr><td colSpan="11" className="no-report">この月のレポートはありません。</td></tr>
            ) : (
              sortedReports.map((report) => (
                <tr key={report.game_id}>
                  <td>{report.game_date || "-"}</td>
                  <td className={report.my_rank === 1 ? "rank-1" : report.my_rank === 2 ? "rank-2" : report.my_rank === 3 ? "rank-3" : report.my_rank === 4 ? "rank-4" : "" }>
                    {report.my_rank || "-"}
                  </td>
                  <td>{report.rank1_players || "-"}<br />{report.rank1_score || "-"}</td>
                  <td>{report.rank2_players || "-"}<br />{report.rank2_score || "-"}</td>
                  <td>{report.rank3_players || "-"}<br />{report.rank3_score || "-"}</td>
                  <td>{report.rank4_players || "-"}<br />{report.rank4_score || "-"}</td>
                  <td>{report.rating != null ? `${parseFloat(report.rating).toFixed(2)}` : "-"}</td>
                  <td>{report.match_rate != null ? `${parseFloat(report.match_rate).toFixed(1)}%` : "-"}</td>
                  <td>{report.bad_rate != null ? `${parseFloat(report.bad_rate).toFixed(1)}%` : "-"}</td>
                  <td>{report.maka || "-"}</td>
                  <td>
                    <a href={report.report_url} className="report-link" target="_blank" rel="noopener noreferrer">
                      レポートを見る
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ReportList;
