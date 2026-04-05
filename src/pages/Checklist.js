// ✅ Checklist.js — verze s detekcí technologie, měřítka a zoomu
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Checklist.css"; // 👈 DŮLEŽITÉ! Připojí tvé CSS

export default function Checklist() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSite = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.error) {
        setResult("⚠️ Web nelze načíst (možná blokace nebo špatná URL).");
      } else {
        let resultText = "";

        // ✅ Detekovaná technologie
        if (data.detected) {
          resultText += `Aplikace je založena na: <b>${data.detected}</b><br/>`;
        } else {
          resultText += `❌ Nebylo nalezeno žádné z následujících řešení:<br/><b>${data.techList}</b><br/>`;
        }

        // ✅ Měřítko
        if (data.hasScale === true)
          resultText += " Aplikace obsahuje měřítko mapy.<br/>";
        else if (data.hasScale === false)
          resultText += "❌ Aplikace neobsahuje zjistitelné měřítko mapy.<br/>";
        else resultText += "⚠️ Nelze určit přítomnost měřítka.<br/>";

        // ✅ Zoom
        if (data.hasZoom === true)
          resultText += " Aplikace umožňuje přibližování/oddalování mapy.";
        else if (data.hasZoom === false)
          resultText += "❌ Aplikace neumožňuje zjistit zoom funkci.";
        else resultText += "⚠️ Nelze určit přítomnost zoomu.";

        setResult(resultText);
      }
    } catch (err) {
      setResult("🚫 Chyba spojení se serverem");
    }

    setLoading(false);
  };

  return (
    <div className="checklist-page">
      <h1>Evaluation</h1>
      <p>Zadejte URL mapové aplikace, kterou chcete hodnotit:</p>

      <input
        type="text"
        placeholder="https://example.com/map"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="url-input"
      />

      <button onClick={analyzeSite} className="analyze-btn">
        Analyzovat
      </button>

      {/* 🔹 Výsledek */}
      {loading && <p>⏳ Probíhá analýza...</p>}
      {result && (
        <p
          className="analysis-result"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      )}

      {/* 🔹 Náhled stránky */}
      {url && (
        <div className="preview-frame" style={{ margin: "2rem 0" }}>
          <h3>Náhled webu</h3>
          <iframe src={url} title="Web preview" className="preview-iframe" />
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Kategorie</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Kartografické</li> 
        <li>Technologické</li>
        <li>GIS</li>
        <li>Použitelnost</li>
        <li>Bezpečnost</li>
        <li>Obecné / Ostatní</li>
      </ul>

      <div className="back-home" style={{ marginTop: "2rem" }}>
        <Link to="/" className="back-button">
          ⬅️ Zpět na úvodní stránku
        </Link>
      </div>
    </div>
  );
}
