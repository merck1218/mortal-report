import Header from "./Header";
import "./Top.css";
import top_overview from "../assets/Mortal_Top_Overview.png"

function Top() {
  return (
    <div>
      <Header />
      <main className="top-main">
        <h2>ようこそ Mortal Report へ</h2>

        <div className="top-overview">
          <p>
            「Mortal Report」は、麻雀AI「Mortal」の牌譜解析結果を保存し、一覧表示することができるアプリケーションです。レーティングや一致率の傾向などを見返すことが可能になります。<br></br>
            「Mortal」の牌譜解析結果をいつでもKillerDucky形式で見返すことが可能です。レーティングやMAKAの評価が低かった対局を見返すなど雀力向上の一助になれば幸いです。<br></br>
            また、「Mortal Report」では一部統計情報を収集しています。レーティングや一致率、放銃時平均シャンテン数などの統計情報を確認することで、自身の成長や課題を把握することができます。
          </p>
          <img src={top_overview} alt="Mortal Report Overview" />
        </div>
      </main>
    </div>
  );
}

export default Top;
