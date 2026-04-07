import { useState } from "react";

function Report({ categories, answers, getResult, generateSummary, onReset }) {
  const results = categories.map((cat) => ({
    title: cat.title,
    ...getResult(cat),
    failedCritical: cat.items.filter(
      (item) =>
        item.weight === 3 &&
        answers[`${cat.id}-${item.id}`] === false
    ),
  }));

  const summaryText = generateSummary();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="criteria-container">
      <div className="report-header">
        <h1 className="lang lang-cs">Souhrnný report</h1>
        <br />
        <h1 className="lang lang-en">Summary Report</h1>

      <div className="page-help">
  <button
    className="help-button"
    onClick={() => setHelpOpen((prev) => !prev)}
    aria-label="Nápověda"
    type="button"
  >
    ?
  </button>

  {helpOpen && (
    <div className="help-popover">
      <h3>Nápověda</h3>

      <ul>
        <li>
          Tento report shrnuje výsledky hodnocení jednotlivých kategorií.
        </li>

        <li>
          Každá karta představuje jednu kategorii a její celkové skóre.
        </li>

        <li>
          Barevný kruh znázorňuje procentuální úspěšnost splněných kritérií.
        </li>

        <li>
          V případě nesplnění povinných kritérií jsou tato kritéria vypsána.
        </li>

        <li>
          Výsledky slouží pro orientační zhodnocení kvality mapové aplikace.
        </li>
      </ul>
    </div>
  )}
</div>

        <p className="lang lang-cs">Přehled výsledků jednotlivých kategorií</p>
        <p className="lang lang-en">Overview of category results</p>
      </div>

      <div className="report-grid">
        {results.map((res, i) => (
          <div key={i} className="report-card">
            <h2>{res.title}</h2>

            <div className="report-circle-wrapper">
              <div
                className="report-circle"
                style={{
                  background: `conic-gradient(
                    ${
                      res.color === "green"
                        ? "#22c55e"
                        : res.color === "orange"
                        ? "#f59e0b"
                        : "#ef4444"
                    }
                    ${res.percentage}%,
                    #e5e7eb ${res.percentage}% 100%
                  )`,
                }}
              >
                <div className="report-percentage">{res.percentage}%</div>
              </div>
            </div>

            <div className="report-stats">
              {res.percentage}%
              <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                {res.yesWeight} / {res.totalWeight} bodů
              </div>

              {res.naCount > 0 && (
                <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                  N/A: {res.naCount}
                </div>
              )}
            </div>

            {res.failedCritical.length > 0 && (
              <div className="report-alert">
                <strong className="lang lang-cs">Nesplněná povinná kritéria:</strong>
                <strong className="lang lang-en">Unmet mandatory criteria:</strong>
                <ul>
                  {res.failedCritical.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="report-summary"
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          background: "#f9fafb",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>
          <span className="lang lang-cs">Celkové hodnocení</span>
          <span className="lang lang-en">Overall evaluation</span>
        </h2>

        <p
          style={{
            fontSize: "1.15rem",
            fontWeight: "600",
            color:
              summaryText.includes("plně")
                ? "#16a34a"
                : summaryText.includes("velmi dobře")
                ? "#22c55e"
                : summaryText.includes("nedostatky")
                ? "#f59e0b"
                : "#ef4444",
            lineHeight: "1.6",
          }}
        >
          {summaryText}
        </p>
      </div>

      <button className="report-back-btn" onClick={onReset}>
        <span className="lang lang-cs">← Zpět na začátek</span>
        <span className="lang lang-en">← Back to start</span>
      </button>
    </div>
  );
}

export default Report;