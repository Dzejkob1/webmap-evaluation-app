import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { globalStats } from "../../utils/evaluationUtils";

const flattenItems = (items) => {
  return items.flatMap((item) => {
    if (item.subitems?.length > 0) {
      return item.subitems.map((sub) => ({
        ...sub,
        id: `${item.id}-${sub.id}`,
        weight: sub.weight ?? item.weight,
        parentText: item.text,
      }));
    }

    return [item];
  });
};

function Report({ categories, answers, getResult, generateSummary, onReset }) {
  const results = categories.map((cat) => {
  const flatItems = flattenItems(cat.items);

  return {
    id: cat.id,
    title: cat.title,
    ...getResult(cat),
    failedCritical: flatItems.filter(
      (item) =>
        item.weight === 3 &&
        answers[`${cat.id}-${item.id}`] === false
    ),
  };
});

  const summaryText = generateSummary(categories, answers);
  const [helpOpen, setHelpOpen] = useState(false);

  const reportRef = useRef(null);
  const currentLang = localStorage.getItem("lang") || "cs";
  const stats = globalStats(categories, answers);

  const downloadPdf = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f4f7f6",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pdfWidth - margin * 2;
      const usableHeight = pdfHeight - margin * 2;

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
      }

      pdf.save("web-map-eval-report.pdf");
    } catch (err) {
      console.error("Chyba při generování PDF:", err);
      alert("Nepodařilo se stáhnout PDF report.");
    }
  };

  return (
    <div className="criteria-container">
      <div ref={reportRef} className="report-export-area">
        <div className="report-header">
          <div className="report-header-row">
            <div className="report-header-text">
              <h1 className="lang lang-cs">Souhrnný report</h1>
              <h1 className="lang lang-en">Summary Report</h1>
            </div>

            <div className="report-header-actions">
              <button
                className="report-download-btn"
                onClick={downloadPdf}
                type="button"
              >
                <span className="lang lang-cs">⬇ Stáhnout PDF</span>
                <span className="lang lang-en">⬇ Download PDF</span>
              </button>

              <div className="report-help">
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
                    <h3>
  <span className="lang lang-cs">Nápověda</span>
  <span className="lang lang-en">Help</span>
</h3>

<ul>
  <li>
    <span className="lang lang-cs">Tento report shrnuje výsledky hodnocení jednotlivých kategorií.</span>
    <span className="lang lang-en">This report summarizes the results for individual categories.</span>
  </li>
  <li>
    <span className="lang lang-cs">Každá karta představuje jednu kategorii a její celkové skóre.</span>
    <span className="lang lang-en">Each card represents one category and its score.</span>
  </li>
  <li>
    <span className="lang lang-cs">Barevný kruh znázorňuje procentuální úspěšnost splněných kritérií.</span>
    <span className="lang lang-en">The colored circle shows the percentage of fulfilled criteria.</span>
  </li>
  <li>
    <span className="lang lang-cs">V případě nesplnění povinných kritérií jsou tato kritéria vypsána.</span>
    <span className="lang lang-en">Unmet mandatory criteria are listed separately.</span>
  </li>
  <li>
    <span className="lang lang-cs">Výsledky slouží pro orientační zhodnocení kvality mapové aplikace.</span>
    <span className="lang lang-en">The results provide an indicative evaluation of the web map application.</span>
  </li>
</ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="report-grid">
          {results.map((res, i) => (
            <div
              key={i}
              className={`report-card ${res.isEmpty ? "report-card-empty" : ""}`}
            >
              <h2>{res.title}</h2>

              <div className="report-circle-wrapper">
                <div
                  className={`report-circle-svg ${res.isEmpty ? "report-circle-empty" : ""}`}
                >
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle
                      cx="65"
                      cy="65"
                      r="50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                    />
                    {!res.isEmpty && (
                      <circle
                        cx="65"
                        cy="65"
                        r="50"
                        fill="none"
                        stroke={
                          res.color === "green"
                            ? "#22c55e"
                            : res.color === "orange"
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 50 * (1 - res.percentage / 100)
                        }`}
                        transform="rotate(-90 65 65)"
                      />
                    )}
                  </svg>

                  <div className="report-percentage">
                    {res.isEmpty ? "—" : `${res.percentage}%`}
                  </div>
                </div>
              </div>

              <div className="report-stats">
                {res.isEmpty ? (
                  <div className="report-status-empty">
                    <div>—</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      <span className="lang lang-cs">Nevyplněno</span>
                      <span className="lang lang-en">Not filled</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {res.percentage}%
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      <span className="lang lang-cs">
  {res.yesWeight} / {res.totalWeight} bodů
</span>
<span className="lang lang-en">
  {res.yesWeight} / {res.totalWeight} points
</span>
                    </div>

                    {res.naCount > 0 && (
                      <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                        N/A: {res.naCount}
                      </div>
                    )}

                    {res.isPartial && (
                      <div className="report-note-partial">
                        <span className="lang lang-cs">Není zcela vyplněno</span>
                        <span className="lang lang-en">Not fully completed</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!res.isEmpty && res.failedCritical.length > 0 && (
                <div className="report-alert">
                  <strong>
                    {currentLang === "en"
                      ? "Unmet criteria:"
                      : "Nesplněná kritéria:"}
                  </strong>
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
              color: !summaryText
                ? "#9ca3af"
                : stats.percentage === 100
                ? "#16a34a"
                : stats.percentage >= 61
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
    </div>
  );
}

export default Report;