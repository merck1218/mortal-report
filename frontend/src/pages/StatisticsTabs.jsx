import React, { useState } from "react";
import Header from "./Header";
import Statistics from "./Statistics"; // 統計一覧ページ
import StatisticsCompare from "./StatisticsCompare"; // 統計比較ページ
import "./StatisticsTabs.css";

function StatisticsTabs() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div>
      <Header />
      <main className="statistics-tabs-container">
        <h1>統計</h1>
        <div className="tab-buttons">
          <button
            className={activeTab === "list" ? "active" : ""}
            onClick={() => setActiveTab("list")}
          >
            統計一覧
          </button>
          <button
            className={activeTab === "compare" ? "active" : ""}
            onClick={() => setActiveTab("compare")}
          >
            統計比較
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "list" && <Statistics />}
          {activeTab === "compare" && <StatisticsCompare />}
        </div>
      </main>
    </div>
  );
}

export default StatisticsTabs;
