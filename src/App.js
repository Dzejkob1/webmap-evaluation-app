// App.js
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CriteriaPage from "./pages/CriteriaPage";
import vyberKategorieImg from "./assets/vyber_kategorie.png";
import vyplneniKriteriiImg from "./assets/vyplneni_kriterii.png";
import reportImg from "./assets/report.png";

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
                <section className="test-banner">
  <h2 className="lang lang-cs">
    Platforma pro hodnocení webových map
  </h2>
  <h2 className="lang lang-en">
    Platform for web map evaluation
  </h2>
  <br></br>


  <div className="banner-about">
    <h3 className="lang lang-cs">O aplikaci</h3>
    <h3 className="lang lang-en">About the application</h3>
    <br></br>
    
    <p className="lang lang-cs">
      Web Map Eval je nástroj pro systematické hodnocení webových
      mapových aplikací. Umožňuje projít připravenou sadu
      hodnoticích kritérií, vyplnit odpovědi a následně zobrazit
      report s výsledkem hodnocení. Hodnocení probíhá formou manuálního checklistu rozděleného
      do tematických kategorií.
    </p>

    <p className="lang lang-en">
      Web Map Eval is a tool for systematic evaluation of web map
      applications. It allows users to go through a prepared set of
      evaluation criteria, fill in the answers and generate a
      summary report. 
      The evaluation is based on a manual checklist divided into
      thematic categories.
    </p>

    <p className="lang lang-cs">
      Kritéria jsou rozdělena do kartografických, uživatelských,
      technologických a bezpečnostních oblastí. Díky tomu lze
      webovou mapovou aplikaci posoudit z více důležitých pohledů.
    </p>

    <p className="lang lang-en">
      The criteria are divided into cartographic, usability,
      technological and security areas. This makes it possible to
      evaluate a web map application from several important
      perspectives.
    </p>
  </div>
</section>

<div className="bubble-container single-bubble">
  <Link to="/criteria" className="bubble secondary">
    <span className="bubble-text lang lang-cs">
      Spustit hodnocení
    </span>
    <span className="bubble-text lang lang-en">
      Start evaluation
    </span>
  </Link>
</div>

<div className="intro-divider"></div>

<section className="intro intro-full">
  <div className="intro-text intro-text-full">
    <div className="testing-grid testing-grid-two">
      <div className="testing-card">
        <h3 className="lang lang-cs">Pro koho je určena</h3>
        <h3 className="lang lang-en">Who it is for</h3>
        <br></br>

        <p className="lang lang-cs">
          Aplikace je určena především pro tvůrce webových map,
      studenty, kartografy a další uživatele, kteří chtějí
      zhodnotit kvalitu vybrané webové mapové aplikace.
        </p>

        <p className="lang lang-en">
          The application is intended mainly for web map creators,
      students, cartographers and other users who want to assess
      the quality of selected web map application.
        </p>
      </div>

      <div className="testing-card">
        <h3 className="lang lang-cs">Vlastní kritéria</h3>
        <h3 className="lang lang-en">Custom criteria</h3>
        <br></br>

        <p className="lang lang-cs">
          Platforma je navržena jako otevřená. Uživatel může
          pracovat s připravenou sadou kritérií, případně ji
          upravit nebo rozšířit podle vlastních potřeb.
        </p>

        <p className="lang lang-en">
          The platform is designed as an open system. Users can
          work with the default set of criteria or modify and
          extend it according to their own needs.
        </p>
      </div>
    </div>

<div className="workflow-section">
      <h2 className="lang lang-cs">Postup hodnocení</h2>
      <h2 className="lang lang-en">Evaluation steps</h2>
    <div className="workflow-steps">
  <div className="workflow-step">
    <img src={vyberKategorieImg} alt="Výběr kategorie" className="workflow-img" />
    <div className="workflow-icon">1</div>
    <h3 className="lang lang-cs">Výběr kategorie</h3>
    <h3 className="lang lang-en">Select category</h3>
  </div>

  <div className="workflow-arrow">→</div>

  <div className="workflow-step">
    <img src={vyplneniKriteriiImg} alt="Vyplnění kritérií" className="workflow-img" />
    <div className="workflow-icon">2</div>
    <h3 className="lang lang-cs">Vyplnění kritérií</h3>
    <h3 className="lang lang-en">Fill criteria</h3>
  </div>

  <div className="workflow-arrow">→</div>

  <div className="workflow-step">
    <img src={reportImg} alt="Zobrazení reportu" className="workflow-img" />
    <div className="workflow-icon">3</div>
    <h3 className="lang lang-cs">Zobrazení reportu</h3>
    <h3 className="lang lang-en">View report</h3>
  </div>

<div className="workflow-arrow workflow-plus">+</div>

<div className="workflow-step workflow-step-admin">
  <h3 className="lang lang-cs">
    administrace
  </h3>

  <h3 className="lang lang-en">
    administration
  </h3>

  <p className="lang lang-cs">
    (možnost práce s vlastními kritérií)
  </p>

  <p className="lang lang-en">
    (the ability to work with custom criteria)
  </p>
</div>
    </div>

    <div className="testing-note">
      <span className="lang lang-cs">
        Aplikace slouží jako zpětná vazba při tvorbě webových mapových aplikací, možnost procesu evaluace a kontroly.
      </span>
      <span className="lang lang-en">
        The application serves as a tool for feedback during the development of web-based map applications, providing process to evaluate and the ability monitor progress.
      </span>
    </div>
    </div>
  </div>
</section>
              </>
            }
          />

          <Route path="/criteria" element={<CriteriaPage lang={lang} />} />
        </Routes>
      </main>

      <div className="intro-divider"></div>

      <footer className="footer">
  <div className="footer-content">
    <span className="lang lang-cs">
      Jakub HERMANN · produkt bakalářské práce "Návrh platformy pro hodnocení webových map" ·
      Univerzita Palackého v Olomouci · Katedra geoinformatiky · @:
    </span>

    <span className="lang lang-en">
      Jakub HERMANN · bachelor thesis project "Design of a Platform for Web Map Evaluation" ·
      Palacký University Olomouc · Department of Geoinformatics · @:
    </span>{" "}

    <a href="mailto:jakub.hermann713@gmail.com">
      jakub.hermann713@gmail.com
    </a>

    <div className="osm-attribution">
      © OpenStreetMap contributors
    </div>
  </div>
</footer>
    </div>
  );
}

export default App;