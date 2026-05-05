import { useState } from "react";

function CriteriaItem({
  number,
  item,
  categoryId,
  answers,
  setAnswer,
  openItems,
  setOpenItems,
}) {
  const baseKey = `${categoryId}-${item.id}`;
  const infoKey = `${baseKey}-info`;
  const subitemsKey = `${baseKey}-subitems`;

  const isInfoOpen = openItems[infoKey];
  const areSubitemsOpen = openItems[subitemsKey];

  const [selectedImage, setSelectedImage] = useState(null);

  const hasSubitems = item.subitems && item.subitems.length > 0;

  const isAnswered = !hasSubitems && answers[baseKey] !== undefined;
  const isUnknown = !hasSubitems && answers[baseKey] === "unknown";

  const toggleInfo = () => {
    setOpenItems((prev) => ({
      ...prev,
      [infoKey]: !prev[infoKey],
    }));
  };

  const toggleSubitems = () => {
    setOpenItems((prev) => ({
      ...prev,
      [subitemsKey]: !prev[subitemsKey],
    }));
  };

  const renderAnswerButtons = (answerKey, answerId) => (
    <div className="criteria-answer">
      <button
        className={`answer yes ${answers[answerKey] === true ? "selected" : ""}`}
        onClick={() => setAnswer(categoryId, answerId, true)}
        type="button"
      >
        <span className="lang lang-cs">ANO</span>
        <span className="lang lang-en">YES</span>
      </button>

      <button
        className={`answer no ${answers[answerKey] === false ? "selected" : ""}`}
        onClick={() => setAnswer(categoryId, answerId, false)}
        type="button"
      >
        <span className="lang lang-cs">NE</span>
        <span className="lang lang-en">NO</span>
      </button>

      <button
        className={`answer na ${answers[answerKey] === "unknown" ? "selected" : ""}`}
        onClick={() => setAnswer(categoryId, answerId, "unknown")}
        type="button"
      >
        <span className="lang lang-cs">
  {item.weight === 3 ? "Nelze zjistit" : "Nelze zjistit / netýká se"}
</span>

<span className="lang lang-en">
  {item.weight === 3 ? "Cannot determine" : "Cannot determine / not applicable"}
</span>
      </button>
    </div>
  );

  return (
    <div
      className={`criteria-item-advanced 
        ${isAnswered ? "answered" : ""} 
        ${item.weight === 3 ? "required" : ""}
        ${isUnknown ? "unknown-state" : ""}
        ${hasSubitems ? "has-subitems" : ""}
      `}
    >
      {/* HEADER */}
      <div className="criteria-main-row">
        <div className="criteria-left">
          <span className="criteria-number">{number}.</span>

          <button className="info-btn" onClick={toggleInfo} type="button">
            {isInfoOpen ? "✕" : "ℹ"}
          </button>

          <span className="criteria-text">{item.text}</span>

          {hasSubitems && (
            <button className="expand-arrow" onClick={toggleSubitems} type="button">
              {areSubitemsOpen ? "▾" : "▸"}
            </button>
          )}
        </div>

        {!hasSubitems && renderAnswerButtons(baseKey, item.id)}
      </div>

      
      {isInfoOpen && (
        <div className="criteria-detail">
          <div className="criteria-detail-layout">
            <div className="criteria-detail-text">
              {item.explanation && (
                <div className="criteria-explanation">{item.explanation}</div>
              )}

              {item.source && (
                <div className="criteria-source">
                  {item.source && (
  <div className="criteria-source">
    <strong>Zdroje:</strong>
    <ul>
      {item.source.split("\n").map((src, i) => (
  <div key={i}>{src}</div>
))}
    </ul>
  </div>
)}
                </div>
              )}

              {item.links?.length > 0 && (
                <div className="criteria-links">
                  {item.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {item.images?.length > 0 && (
              <div className="criteria-images">
                {item.images.map((img, i) => {
                  const tooltipParts = [
                    img.source,
                    img.author,
                    img.license,
                  ].filter(Boolean);

                  return (
                    <button
                      key={i}
                      type="button"
                      className="criteria-image-button"
                      onClick={() => setSelectedImage(img)}
                      title={tooltipParts.join(" | ")}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}${img.src}`}
                        alt={img.alt || item.text}
                        className="criteria-image-thumb"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      
      {hasSubitems && areSubitemsOpen && (
        <div className="criteria-subitems">
          {item.subitems.map((sub, index) => {
            const subId = `${item.id}-${sub.id}`;
            const subKey = `${categoryId}-${subId}`;

            return (
              <div
                key={sub.id}
                className={`criteria-subitem 
                  ${answers[subKey] !== undefined ? "answered" : ""}
                  ${answers[subKey] === "unknown" ? "unknown-state" : ""}
                `}
              >
                <div className="criteria-main-row">
                  <div className="criteria-left">
                    <span className="criteria-number">
                      {number}.{index + 1}
                    </span>
                    <span className="criteria-text">{sub.text}</span>
                  </div>

                  {renderAnswerButtons(subKey, subId)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {selectedImage && (
        <div
          className="image-modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <img
              src={`${process.env.PUBLIC_URL}${selectedImage.src}`}
              alt={selectedImage.alt || item.text}
              className="image-modal-img"
            />

            <div className="image-modal-meta">
              {selectedImage.source && (
                <div><strong>Zdroj:</strong> {selectedImage.source}</div>
              )}
              {selectedImage.author && (
                <div><strong>Autor:</strong> {selectedImage.author}</div>
              )}
              {selectedImage.license && (
                <div><strong>Licence:</strong> {selectedImage.license}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CriteriaItem;