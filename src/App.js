// App.js
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Checklist from "./pages/Checklist";
import CriteriaPage from "./pages/CriteriaPage";


function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "cs");

  useEffect(() => {
    document.body.setAttribute("data-lang", lang);
    localStorage.setItem("lang", lang);
  }, [lang]);

  const location = useLocation();
  const isHomePage = location.pathname === "/"; 

  return (
    <div className="homepage">
      <header className="header">

      {!isHomePage && (
  <div className="header-back">
    <Link to="/" className="header-back-button">
      <span className="lang lang-cs">← Zpět na úvod</span>
      <span className="lang lang-en">← Back to homepage</span>
    </Link>
  </div>
)}

        <div className="language-switch">
          <button
            className={lang === "cs" ? "active" : ""}
            onClick={() => setLang("cs")}
          >
            CZ
          </button>
          <button
    className="disabled-lang"
    type="button"
    disabled
    title="English version is not available yet"
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
    <section className="test-banner">
      <h2>Testování nástroje pro hodnocení webových map</h2>
      <p>
        Tato verze aplikace slouží k ověření základního principu a funkčnosti
        nástroje. Pomocí připravených kritérií si můžete vyzkoušet evaluaci
        webové mapové aplikace a následně poskytnout zpětnou vazbu.
      </p>
    </section>

    <div className="bubble-container single-bubble">
      <Link to="/criteria" className="bubble secondary">
        <span className="bubble-text lang lang-cs">Vyzkoušet hodnocení</span>
        <span className="bubble-text lang lang-en">Try evaluation</span>
      </Link>
    </div>

    <div className="intro-divider"></div>

    <section className="intro intro-full">
      <div className="intro-text intro-text-full">
        <h2 className="lang lang-cs">O testování</h2><br></br>
        <h2 className="lang lang-en">About testing</h2>

        <p className="intro-lead lang lang-cs">
          Cílem testování je získat zpětnou vazbu k funkčnosti, srozumitelnosti
          a praktické použitelnosti nástroje pro hodnocení webových map.
        </p>


        <p className="lang lang-cs">
          V této testovací verzi je aplikace naplněna výchozím datasetem
          vytvořeném v rámci bakalářské práce.
          Produkční verze nástroje bude rozšířena také o základní administraci, tedy možnost upravovat
          a přidávat vlastní hodnotící kritéria.
        </p>

        <div className="testing-grid">
          <div className="testing-card">
            <h3>Co je cílem aplikace</h3>
            <p>
              Aplikace má sloužit jako nástroj pro hodnocení webových mapových aplikací. Jednoduše a přehledně umožnit
              zhodnocení vybranného produktu ať už pomocí pilotní sady otázek, či použítí vlastních kritérií. - !možnost přidání až v produkční verzi! 
            </p>
          </div>

          <div className="testing-card">
            <h3>Pro koho je určena</h3>
            <p>
              Především pro tvůrce webových map, studenty a další uživatele,
              kteří chtějí využít nástroj pro hodnocení svého produktu.
            </p>
          </div>

          <div className="testing-card">
            <h3>Jak testování probíhá</h3>
            <ol>
              <li>Vyzkoušejte si nástroj na připraveném datasetu.</li>
              <li>Projděte jednotlivé kategorie a vyplňte kritéria.</li>
              <li>Zobrazte si závěrečný report.</li>
              <li>Poté prosím vyplňte krátký dotazník zpětné vazby.</li>
            </ol>
          </div>

          <div className="testing-card">
            <h3>Dotazník zpětné vazby</h3>
            <p>
              Po otestování aplikace prosím vyplňte krátký formulář.  
            </p>

            <div className="form-placeholder">
              FORMULÁŘ
            </div>
          </div>
        </div>

        <div className="testing-note">
          <strong>Poznámka:</strong> Tato verze aplikace slouží pouze pro
          testování základního principu hodnocení, fungování aplikace a uživatelské přívětivosti.
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
  <div className="footer-content">
    Jakub HERMANN · nástroj je produktem bakalářské práce "Návrh platformy pro hodnocení webových map" · Univerzita Palackého v Olomouci · Katedra geoinformatiky · 
    @:{" "}
    <a href="mailto:jakub.hermann713@gmail.com">
      jakub.hermann713@gmail.com
    </a>
  </div>
</footer>
    </div>
  );
}

export default App;