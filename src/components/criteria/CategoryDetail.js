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

  const handlePrev = () => {
    goPrev();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    goNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                

                <h3>
  <span className="lang lang-cs">Nápověda</span>
  <span className="lang lang-en">Help</span>
</h3>

<ul>
  <li>
    <span className="lang lang-cs">Vyplň všechna kritéria, ab nebylo zkreslono hodnocení.</span>
    <span className="lang lang-en">Fill in all the criteria so that the evaluation isn't skewed.</span>
  </li>

  <li>
    <span className="lang lang-cs">
  Odpovědi:<br />
  <strong>ANO</strong> – aplikace kritérium splňuje.<br />
  <strong>NE</strong> – aplikace kritérium nesplňuje.<br />
  <strong>Nelze zjistit</strong> – kritérium nelze z dostupné podoby aplikace spolehlivě posoudit a nevstupuje do výsledku.
</span>

<span className="lang lang-en">
  Answers:<br />
  <strong>YES</strong> – the application meets the criterion.<br />
  <strong>NO</strong> – the application does not meet the criterion.<br />
  <strong>Cannot determine</strong> – the criterion cannot be reliably assessed from the available application view and is excluded from the result.
</span>
  </li>
</ul>
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
    onClick={handlePrev}
    disabled={currentIndex === 0}
  >
    <span className="lang lang-cs">← Předchozí</span>
    <span className="lang lang-en">← Previous</span>
  </button>

  <button className="nav-button" onClick={handleNext}>
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