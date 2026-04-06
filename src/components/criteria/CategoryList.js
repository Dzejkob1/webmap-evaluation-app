import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function CategoryList({
  categories,
  onSelect,
  onDownloadJson,
  onDownloadEmptyJson,
  onUploadJson,
  onUploadCsv,
  onCustom,
  onToggleIgnore,
  onDeleteCustom,
  onRestoreDefaults,
}) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
  <>
    <div className="category-page-header">
      <div className="category-page-title-block">
        <h1>Seznam kategorií</h1>

        <div className="top-navigation">
          <Link to="/" className="home-button">
            <span className="lang lang-cs">← Zpět na úvod</span>
            <span className="lang lang-en">← Back to homepage</span>
          </Link>
        </div>
      </div>

      <div className="category-page-actions">
        <div
          ref={toolsRef}
          style={{ display: "inline-block", position: "relative", marginRight: "0.5rem" }}
        >
          <button
            className="home-button"
            onClick={() => setToolsOpen((prev) => !prev)}
          >
            Vlastní kritéria
          </button>

          {toolsOpen && (
            <div className="tools-dropdown-menu">
              <button
                className="tools-dropdown-item"
                onClick={() => {
                  onDownloadJson();
                  setToolsOpen(false);
                }}
              >
                ⬇ Stáhnout aktuální JSON
              </button>

              <button
                className="tools-dropdown-item"
                onClick={() => {
                  onDownloadEmptyJson();
                  setToolsOpen(false);
                }}
              >
                ⬇ Stáhnout prázdnou JSON šablonu
              </button>

              <button
                className="tools-dropdown-item"
                onClick={() => {
                  onUploadJson();
                  setToolsOpen(false);
                }}
              >
                ⬆ Nahrát JSON
              </button>

              <button
                className="tools-dropdown-item"
                onClick={() => {
                  onRestoreDefaults();
                  setToolsOpen(false);
                }}
              >
                ↺ Obnovit původní kategorie
              </button>
            </div>
          )}
        </div>

        <button
          className="home-button"
          onClick={onUploadCsv}
          style={{ marginRight: "0.5rem" }}
        >
          ⬆ CSV
        </button>

        <button className="home-button" onClick={onCustom}>
          + Vlastní
        </button>
      </div>
    </div>

    <div className="category-grid">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`category-card ${cat.ignored ? "ignored-card" : ""}`}
          onClick={() => {
            if (!cat.ignored) onSelect(cat);
          }}
        >
          <button
            className="category-action-btn category-ignore-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleIgnore(cat.id);
            }}
          >
            {cat.ignored ? "Obnovit" : "Ignorovat"}
          </button>

          {cat.isCustom && (
            <button
              className="category-action-btn category-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCustom(cat.id);
              }}
            >
              ✕
            </button>
          )}

          <h2>{cat.title}</h2>
          <p>{cat.description}</p>

          {cat.ignored && (
            <p className="ignored-label">Tato kategorie je ignorována</p>
          )}
        </div>
      ))}
    </div>
  </>
);
}

export default CategoryList;