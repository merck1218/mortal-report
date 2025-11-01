import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedValues, setEditedValues] = useState({});
  
  const handleValueChange = (id, newValue) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const fetchSettings = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      setSettings(res.data.settings || []);
    } catch (err) {
      console.error("取得失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (id, value) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${API_BASE_URL}/api/settings/${id}`, { value });
      alert("設定が更新されました。");
      fetchSettings();
    } catch (err) {
      console.error("更新失敗:", err);
      alert("設定の更新に失敗しました。");
    }
  };

  useEffect(() => { 
    fetchSettings();
  }, []);

  return (
    <div>
      <Header />
      <main className="settings-container">
        <h1>設定</h1>

        <table className="settings-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>設定名</th>
              <th>説明</th>
              <th>設定値</th>
              <th>設定値変更</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">読み込み中...</td>
              </tr>
            ) : settings.length === 0 ? (
              <tr>
                <td colSpan="5">設定が見つかりません。</td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id}>
                  <td>{setting.id}</td>
                  <td>{setting.item}</td>
                  <td>{setting.explain}</td>
                  <td>{setting.value}</td>
                  <td>
                    <input
                      type="text"
                      value={editedValues[setting.id] ?? setting.value}
                      onChange={(e) => handleValueChange(setting.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => updateSetting(setting.id, editedValues[setting.id] ?? setting.value)}>
                      更新
                    </button>
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

export default Settings;
