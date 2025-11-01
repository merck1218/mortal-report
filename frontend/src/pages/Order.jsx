import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Order.css";

function Order() {
  const [url, setUrl] = useState("");
  const [maka, setMaka] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("解析中...");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${API_BASE_URL}/api/order`, {
        url,
        maka,
        date,
      });
      setStatus("解析完了: " + res.data.status);
    } catch (err) {
      setStatus("解析失敗: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <Header />
      <main className="order-container">
        <h1>対局解析</h1>
        <form onSubmit={handleSubmit} className="order-form">
          <label>
            MAKAレポートURL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例：https://mjai.ekyu.moe/killerducky/?data=/report/..."
              required
            />
          </label>

          <label>
            MAKA評価（任意）:
            <select value={maka} onChange={(e) => setMaka(e.target.value)}>
                <option value="">なし</option>
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
        </label>

          <label>
            対局日付（任意）:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button type="submit">解析する</button>
        </form>

        {status && <p className="order-status">{status}</p>}
      </main>
    </div>
  );
}

export default Order;
