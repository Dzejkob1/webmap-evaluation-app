import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const reportRef = useRef(null);
  const currentLang = localStorage.getItem("lang") || "cs";


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
                  <h3>Nápověda</h3>
                  <ul>
                    <li>Tento report shrnuje výsledky hodnocení jednotlivých kategorií.</li>
                    <li>Každá karta představuje jednu kategorii a její celkové skóre.</li>
                    <li>Barevný kruh znázorňuje procentuální úspěšnost splněných kritérií.</li>
                    <li>V případě nesplnění povinných kritérií jsou tato kritéria vypsána.</li>
                    <li>Výsledky slouží pro orientační zhodnocení kvality mapové aplikace.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="report-grid">
        {results.map((res, i) => (
          <div key={i} className="report-card">
            <h2>{res.title}</h2>

            <div className="report-circle-wrapper">
  <div className="report-circle-svg">
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle
        cx="65"
        cy="65"
        r="50"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="14"
      />
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
    </svg>

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
                <strong>
  {currentLang === "en"
    ? "Unmet mandatory criteria:"
    : "Nesplněná povinná kritéria:"}
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
  </div>
);
}

export default Report;