import { useState } from "react";
import CriteriaItem from "./CriteriaItem";

function CategoryDetail({
  category,
  answers,
  setAnswer,
  resetCategoryAnswers,
  goNext,
  goPrev,
  currentIndex,
  categories,
  openItems,
  setOpenItems,
  getResult,
  onBack,
}) {
  const result = getResult(category);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="criteria-container">
      <div className="category-detail-header">
        <h1>{category.title}</h1>

        <div className="category-detail-actions">
          <button className="back-button" onClick={onBack} type="button">
            <span className="lang lang-cs">← Zpět na kategorie</span>
            <span className="lang lang-en">← Back to categories</span>
          </button>

          <button
            className="back-button"
            onClick={() => resetCategoryAnswers(category.id)}
            type="button"
          >
            <span className="lang lang-cs">↺ Resetovat kritéria</span>
            <span className="lang lang-en">↺ Reset criteria</span>
          </button>

          <div className="page-help page-help-inline">
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
    Vyplň všechna kritéria v dané kategorii.
  </li>

  <li>
    V této testovací verzi jsou zobrazena pouze základní povinná kritéria.
  </li>

  <li>
    Odpovědi:
    <br />
    <strong>ANO</strong> – hodnocená aplikace splňuje kritérium.
    <br />
    <strong>NE</strong> – hodnocená aplikace kritérium nesplňuje.
  </li>

  <li>
    Po vyplnění všech kategorií se zobrazí souhrnný report.
  </li>
</ul>

                {/*<ul>
                  <li>Vyplň všechna kritéria. Dělí se podle váhy.</li>
                  <li>
                    Váha 3 <span className="required-star">*</span> – povinné kritérium.
                    To, co musí každá webová mapová aplikace splňovat.
                  </li>
                  <li>
                    Váha 2 <span style={{ color: "#4f46e5", fontWeight: "bold" }}>*</span> – 
                    neplatí obecně pro všechny případy, ale pokud se týká tvojí aplikace
                    (je to tvůj záměr), má jasnou definici.
                  </li>
                  <li>Váha 1 – nepovinná kritéria.</li>
                  <li>
                    Odpovědi:
                    <br />
                    <strong>ANO</strong> – tvoje aplikace splňuje kritérium.
                    <br />
                    <strong>NE</strong> – tvoje aplikace nesplňuje kritérium (ale týká se jí).
                    <br />
                    <strong>N/A</strong> – tvoje aplikace se dané kritérium netýká.
                  </li>
                </ul>*/}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="criteria-intro">{category.description}</p>

      <div className="criteria-items">
        {category.items.map((item, index) => (
          <CriteriaItem
            key={item.id}
            number={index + 1}
            item={item}
            categoryId={category.id}
            answers={answers}
            setAnswer={setAnswer}
            openItems={openItems}
            setOpenItems={setOpenItems}
          />
        ))}
      </div>

      <div className="criteria-progress-bar">
        <div
          className={`criteria-progress-fill ${result.color}`}
          style={{ width: `${result.percentage}%` }}
        ></div>
      </div>

      <div className={`category-result ${result.color}`}>
        <span className="lang lang-cs">
          Splněno: {result.yesWeight} / {result.totalWeight} ({result.percentage}%)
        </span>
        <span className="lang lang-en">
          Completed: {result.yesWeight} / {result.totalWeight} ({result.percentage}%)
        </span>
      </div>

      <div className="category-navigation">
        <button
          className="nav-button"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <span className="lang lang-cs">← Předchozí</span>
          <span className="lang lang-en">← Previous</span>
        </button>

        <button className="nav-button" onClick={goNext}>
          <span className="lang lang-cs">
            {currentIndex === categories.length - 1 ? "Zobrazit report →" : "Další →"}
          </span>
          <span className="lang lang-en">
            {currentIndex === categories.length - 1 ? "Show report →" : "Next →"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CategoryDetail;