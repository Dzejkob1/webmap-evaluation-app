// App.js
import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Checklist from "./pages/Checklist";
import CriteriaPage from "./pages/CriteriaPage";


function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "cs");

  useEffect(() => {
    document.body.setAttribute("data-lang", lang);
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div className="homepage">
      <header className="header">
        <div className="language-switch">
          <button
            className={lang === "cs" ? "active" : ""}
            onClick={() => setLang("cs")}
          >
            CZ
          </button>
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>

        <h1>Web Map Eval</h1>
        <p className="lang lang-cs">NÁSTROJ PRO HODNOCENÍ WEBOVÝCH MAP</p>
        <p className="lang lang-en">WEB MAP EVALUATION TOOL</p>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
  element={
    <>
      <div className="bubble-container single-bubble">
        <Link to="/criteria" className="bubble secondary">
          <span className="bubble-text lang lang-cs">Hodnocení</span>
          <span className="bubble-text lang lang-en">Criteria List</span>
        </Link>
      </div>

      <div className="intro-divider"></div>

      <section className="intro intro-full">
        <div className="intro-text intro-text-full">
          <h2 className="lang lang-cs">O aplikaci</h2>
<h2 className="lang lang-en">About App</h2><br></br>

<p className="intro-lead lang lang-cs">
  Tato webová aplikace slouží pro hodnocení vybraných webových mapových aplikací
  na základě definovaných kartografických a technologických kritérií.
</p>

<ul className="lang lang-cs">
  <li>Umožňuje systematické vyhodnocení kvality webové mapy.</li>
  <li>Pracuje s váženými kritérii (povinná, doporučená, volitelná).</li>
  <li>Generuje přehledný závěrečný report.</li>
</ul>

<p className="intro-lead lang lang-en">
  This application evaluates web mapping applications based on defined criteria.
</p>

          <div className="intro-extra">
            {/* sem můžeš později doplnit další odstavce, odrážky nebo metodiku */}
          </div>
        </div>
      </section>
    </>
  }
          />

          <Route path="/checklist/*" element={<Checklist />} />
          <Route path="/criteria" element={<CriteriaPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p className="lang lang-cs">© 2025 Bakalářská práce – Jakub HERMANN</p>
        <p className="lang lang-en">© 2025 Bachelor Thesis – Jakub HERMANN</p>
      </footer>
    </div>
  );
}

export default App;