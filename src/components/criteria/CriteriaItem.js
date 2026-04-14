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
  const key = `${categoryId}-${item.id}`;
  const isOpen = openItems[key];
  const [selectedImage, setSelectedImage] = useState(null);

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
            type="button"
          >
            {isOpen ? "✕" : "ℹ"}
          </button>

          <span className="criteria-text">
            {item.text}
          </span>
        </div>

        <div className="criteria-answer">
          <button
            className={`answer yes ${answers[key] === true ? "selected" : ""}`}
            onClick={() => setAnswer(categoryId, item.id, true)}
            type="button"
          >
            ANO
          </button>

          <button
            className={`answer no ${answers[key] === false ? "selected" : ""}`}
            onClick={() => setAnswer(categoryId, item.id, false)}
            type="button"
          >
            NE
          </button>

          {item.weight !== 3 && (
            <button
              className={`answer na ${answers[key] === "na" ? "selected" : ""}`}
              onClick={() => setAnswer(categoryId, item.id, "na")}
              type="button"
            >
              N/A
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="criteria-detail">
          <div className="criteria-detail-layout">
            <div className="criteria-detail-text">
              <div className="criteria-explanation">
                {item.explanation}
              </div>

              {item.source && (
  <div className="criteria-source">
    <strong>Metodický zdroj kritéria:</strong> {item.source}
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
      )}
    </div>
  );
}

export default CriteriaItem;