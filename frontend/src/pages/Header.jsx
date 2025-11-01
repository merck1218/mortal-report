import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="top-header">
      <div className="top-nav-container">
        <Link to="/top/" className="top-logo">Mortal Report</Link>
        <nav className="top-nav">
          <Link
            to="/order/"
            className={`top-nav-item ${isActive("/order/") ? "active" : ""}`}
          >
            解析
          </Link>
          <Link
            to="/report_list/"
            className={`top-nav-item ${isActive("/report_list/") ? "active" : ""}`}
          >
            レポート一覧
          </Link>
          <Link
            to="/statistics_tabs/"
            className={`top-nav-item ${isActive("/statistics_tabs/") ? "active" : ""}`}
          >
            統計
          </Link>
          <Link
            to="/settings/"
            className={`top-nav-item ${isActive("/settings/") ? "active" : ""}`}
          >
            設定
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
