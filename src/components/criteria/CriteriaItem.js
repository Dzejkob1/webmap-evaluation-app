function CriteriaItem({
  number,
  item,
  categoryId,
  answers,
  setAnswer,
  openItems,
  setOpenItems,
}) {
  const key = `${categoryId}-${item.id}`;
  const isOpen = openItems[key];

  return (
    <div
      className={`criteria-item-advanced 
        ${answers[key] !== undefined ? "answered" : ""} 
        ${item.weight === 3 ? "required" : ""}
      `}
    >
      <div className="criteria-main-row">
        <div className="criteria-left">
          <span className="criteria-number">{number}.</span>

          <button
            className="expand-btn"
            onClick={() =>
              setOpenItems((prev) => ({
                ...prev,
                [key]: !prev[key],
              }))
            }
          >
            {isOpen ? "✕" : "ℹ"}
          </button>

          <span className="criteria-text">
            {item.text}
            {item.weight === 3 && (
              <span className="required-star">*</span>
            )}
          </span>

          <span className="criteria-weight">
            <span className="lang lang-cs">Váha:</span>
            <span className="lang lang-en">Weight:</span>{" "}
            {item.weight}
          </span>
        </div>

        <div className="criteria-answer">
          <button
            className={`answer yes ${answers[key] === true ? "selected" : ""}`}
            onClick={() => setAnswer(categoryId, item.id, true)}
          >
            ANO
          </button>

          <button
            className={`answer no ${answers[key] === false ? "selected" : ""}`}
            onClick={() => setAnswer(categoryId, item.id, false)}
          >
            NE
          </button>

          {item.weight !== 3 && (
            <button
              className={`answer na ${answers[key] === "na" ? "selected" : ""}`}
              onClick={() => setAnswer(categoryId, item.id, "na")}
            >
              N/A
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="criteria-detail">
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <div className="criteria-explanation">
                {item.explanation}
              </div>

              {item.source && (
                <div className="criteria-source">
                  <strong>Zdroj:</strong> {item.source}
                </div>
              )}

              {item.links?.length > 0 && (
                <div className="criteria-links">
                  {item.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {item.images?.length > 0 && (
              <div className="criteria-images">
                {item.images.map((src, i) => (
                  <img key={i} src={src} alt={item.text} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CriteriaItem;