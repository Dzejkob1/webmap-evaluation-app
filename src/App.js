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
                  <p className="lang lang-cs">
                    Web Map Eval je nástroj pro systematické hodnocení webových
                    mapových aplikací. Umožňuje projít připravenou sadu
                    hodnoticích kritérií, vyplnit odpovědi a následně zobrazit
                    přehledný report s výsledkem hodnocení.
                  </p>

                  <p className="lang lang-en">
                    Web Map Eval is a tool for systematic evaluation of web map
                    applications. It allows users to go through a prepared set of
                    evaluation criteria, fill in the answers and generate a clear
                    summary report.
                  </p>
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
                    <h2 className="lang lang-cs">O aplikaci</h2>
                    <h2 className="lang lang-en">About the application</h2>
                    <br></br>

                    <p className="intro-lead lang lang-cs">
                      Aplikace je určena především pro tvůrce webových map,
                      studenty, kartografy a další uživatele, kteří chtějí
                      zhodnotit kvalitu vlastní nebo vybrané mapové aplikace.
                      Hodnocení probíhá formou checklistu rozděleného do
                      tematických kategorií.
                    </p>

                    <p className="intro-lead lang lang-en">
                      The application is intended mainly for web map creators,
                      students, cartographers and other users who want to assess
                      the quality of their own or selected web map application.
                      The evaluation is based on a checklist divided into
                      thematic categories.
                    </p>

                    <div className="testing-grid">
                      <div className="testing-card">
                        <h3 className="lang lang-cs">Co aplikace hodnotí</h3>
                        <h3 className="lang lang-en">What is evaluated</h3>

                          <br></br>

                        <p className="lang lang-cs">
                          Kritéria jsou rozdělena do několika oblastí, například
                          kartografické, uživatelské, technologické a
                          bezpečnostní. Díky tomu lze posoudit webovou mapu z
                          více pohledů.
                        </p>

                        <p className="lang lang-en">
                          The criteria are divided into several areas, such as
                          cartographic, usability, technological and security
                          aspects. This makes it possible to evaluate a web map
                          from multiple perspectives.
                        </p>
                      </div>

                      <div className="testing-card">
                        <h3 className="lang lang-cs">Pro koho je určena</h3>
                        <h3 className="lang lang-en">Who it is for</h3>

                        <br></br>

                        <p className="lang lang-cs">
                          Nástroj může sloužit autorům webových map jako pomůcka
                          pro kontrolu kvality, studentům při výuce webové
                          kartografie nebo uživatelům, kteří chtějí porovnat
                          různé mapové aplikace.
                        </p>

                        <p className="lang lang-en">
                          The tool can help web map authors check the quality of
                          their applications, support students in web cartography
                          courses or help users compare different map
                          applications.
                        </p>
                      </div>

                      <div className="testing-card">
                        <h3 className="lang lang-cs">Jak hodnocení probíhá</h3>
                        <h3 className="lang lang-en">Evaluation workflow</h3>

                        <ol className="lang lang-cs">
                          <li>Vyberte hodnoticí kategorii.</li>
                          <li>Vyplňte jednotlivá kritéria.</li>
                          <li>Přejděte na další kategorii.</li>
                          <li>Zobrazte souhrnný report.</li>
                        </ol>

                        <ol className="lang lang-en">
                          <li>Select an evaluation category.</li>
                          <li>Fill in the individual criteria.</li>
                          <li>Continue to the next category.</li>
                          <li>Display the summary report.</li>
                        </ol>
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
                          <div className="workflow-icon">1</div>
                          <h3 className="lang lang-cs">Výběr kategorie</h3>
                          <h3 className="lang lang-en">Select category</h3>
                          <br></br>
                          <p className="lang lang-cs">
                            Uživatel zvolí oblast, kterou chce hodnotit.
                          </p>
                          <p className="lang lang-en">
                            The user selects the area to be evaluated.
                          </p>
                        </div>

                        <div className="workflow-arrow">→</div>

                        <div className="workflow-step">
                          <div className="workflow-icon">2</div>
                          <h3 className="lang lang-cs">Vyplnění kritérií</h3>
                          <h3 className="lang lang-en">Fill criteria</h3>
                          <br></br>
                          <p className="lang lang-cs">
                            Kritéria se vyplňují odpověďmi podle stavu
                            hodnocené aplikace.
                          </p>
                          <p className="lang lang-en">
                            Criteria are answered according to the evaluated
                            application.
                          </p>
                        </div>

                        <div className="workflow-arrow">→</div>

                        <div className="workflow-step">
                          <div className="workflow-icon">3</div>
                          <h3 className="lang lang-cs">Navigace kategoriemi</h3>
                          <h3 className="lang lang-en">Navigate categories</h3>
                          <br></br>
                          <p className="lang lang-cs">
                            Uživatel může postupně projít všechny tematické
                            oblasti.
                          </p>
                          <p className="lang lang-en">
                            The user can go through all thematic areas step by
                            step.
                          </p>
                        </div>

                        <div className="workflow-arrow">→</div>

                        <div className="workflow-step">
                          <div className="workflow-icon">4</div>
                          <h3 className="lang lang-cs">Zobrazení reportu</h3>
                          <h3 className="lang lang-en">View report</h3>
                          <br></br>
                          <p className="lang lang-cs">
                            Na konci se zobrazí souhrnné vyhodnocení včetně
                            slovního komentáře.
                          </p>
                          <p className="lang lang-en">
                            At the end, a summary report with textual evaluation
                            is generated.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="testing-note">
                      <strong className="lang lang-cs">Poznámka:</strong>
                      <strong className="lang lang-en">Note:</strong>{" "}
                      <span className="lang lang-cs">
                        Výsledky hodnocení slouží jako orientační zpětná vazba
                        a pomůcka pro zlepšení webové mapové aplikace.
                      </span>
                      <span className="lang lang-en">
                        The evaluation results serve as indicative feedback and
                        as a guide for improving a web map application.
                      </span>
                    </div>
                  </div>
                </section>
              </>
            }
          />

          <Route path="/checklist/*" element={<Checklist />} />
          <Route path="/criteria" element={<CriteriaPage lang={lang} />} />
        </Routes>
      </main>

      <div className="intro-divider"></div>

      <footer className="footer">
        <div className="footer-content">
          Jakub HERMANN · nástroj je produktem bakalářské práce "Návrh platformy
          pro hodnocení webových map" · Univerzita Palackého v Olomouci ·
          katedra geoinformatiky · @:{" "}
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