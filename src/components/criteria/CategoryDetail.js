import { Link } from "react-router-dom";
import CriteriaItem from "./CriteriaItem";

function CategoryDetail({
  category,
  answers,
  setAnswer,
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

  return (
    <div className="criteria-container">
      <div className="top-navigation">
        <Link to="/" className="home-button">
          <span className="lang lang-cs">← Zpět na úvod</span>
          <span className="lang lang-en">← Back to homepage</span>
        </Link>
      </div>

      <button className="back-button" onClick={onBack}>
        <span className="lang lang-cs">← Zpět na kategorie</span>
        <span className="lang lang-en">← Back to categories</span>
      </button>

      <h1>{category.title}</h1>

      <p className="criteria-intro">{category.description}</p>

      {category.items.some((item) => item.weight === 3) && (
        <p className="criteria-legend">
          <span className="required-star">*</span>
          <span className="lang lang-cs"> Povinné kritérium</span>
          <span className="lang lang-en"> Mandatory criterion</span>
        </p>
      )}

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
            {currentIndex === categories.length - 1
              ? "Zobrazit report →"
              : "Další →"}
          </span>

          <span className="lang lang-en">
            {currentIndex === categories.length - 1
              ? "Show report →"
              : "Next →"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CategoryDetail;