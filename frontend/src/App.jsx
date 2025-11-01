import { Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import Order from "./pages/Order"
import ReportList from "./pages/ReportList";
import Statistics from "./pages/Statistics";
import StatisticsTabs from "./pages/StatisticsTabs";
import StatisticsCompare from "./pages/StatisticsCompare";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/top/" element={<Top />} />
      <Route path="/order/" element={<Order />} />
      <Route path="/report_list/" element={<ReportList />} />
      <Route path="/statistics_tabs/" element={<StatisticsTabs />} />
      <Route path="/statistics/" element={<Statistics />} />
      <Route path="/statistics_compare/" element={<StatisticsCompare />} />
      <Route path="/settings/" element={<Settings />} />
    </Routes>
  );
}

export default App;
