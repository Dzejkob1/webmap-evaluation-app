import { useEffect, useState, useRef } from "react";

function CategoryList({
  categories,
  onSelect,
  onGoToReport,
  onDownloadJson,
  onDownloadEmptyJson,
  onUploadJson,
  onCustom,
  onToggleIgnore,
  onDeleteCustom,
  onRestoreDefaults,
}) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
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

  const categoryIcons = {
    cartography: "🗺️",
    usability: "👤",
    technology: "⚙️",
    safety: "🛡️",
  };

  const getCategoryIcon = (cat) => {
    if (categoryIcons[cat.id]) return categoryIcons[cat.id];
    if (cat.isCustom) return "✳️";
    return "📁";
  };

  return (
    <>
      <div className="category-page-header">
        <div className="category-page-title-block">
          <h1>
            <span className="lang lang-cs">Kategorie</span>
            <span className="lang lang-en">Categories</span>
          </h1>

          <div className="page-help">
            <button
              className="help-button"
              onClick={() => setHelpOpen((prev) => !prev)}
              aria-label="Help"
              type="button"
            >
              ?
            </button>

            {helpOpen && (
              <div className="help-popover">
                <h3>
                  <span className="lang lang-cs">Jak na to?</span>
                  <span className="lang lang-en">How to use?</span>
                </h3>

                <ul>
                  <li>
                    <span className="lang lang-cs">
                      Vyber kategorii kliknutím na kartu a pokračuj až k reportu.
                    </span>
                    <span className="lang lang-en">
                      Select a category and proceed step-by-step to the final report.
                    </span>
                  </li>

                  <li>
                    <span className="lang lang-cs">
                      Pomocí „Vlastní kritéria“ můžeš pracovat s vlastním JSON souborem.
                    </span>
                    <span className="lang lang-en">
                      Use “Custom criteria” to manage your own JSON file.
                    </span>
                  </li>

                  <li>
                    <span className="lang lang-cs">
                      Kategorie lze dočasně vyloučit pomocí „Ignorovat“.
                    </span>
                    <span className="lang lang-en">
                      Categories can be excluded using “Ignore”.
                    </span>
                  </li>

                  <li>
                    <span className="lang lang-cs">
                      Tlačítkem „Obnovit“ vrátíš původní stav kategorií.
                    </span>
                    <span className="lang lang-en">
                      Use “Restore” to return to default categories.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="category-page-actions">
          <div
            ref={toolsRef}
            style={{
              display: "inline-block",
              position: "relative",
              marginRight: "0.5rem",
            }}
          >
            <div className="tools-dropdown-wrapper" ref={toolsRef}>
              <button
                className="home-button"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setToolsOpen((prev) => !prev);
                }}
              >
                <span className="lang lang-cs">Vlastní kritéria</span>
                <span className="lang lang-en">Custom criteria</span>
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
                    <span className="lang lang-cs">⬇ Stáhnout aktuální JSON</span>
                    <span className="lang lang-en">⬇ Download current JSON</span>
                  </button>

                  <button
                    className="tools-dropdown-item"
                    onClick={() => {
                      onDownloadEmptyJson();
                      setToolsOpen(false);
                    }}
                  >
                    <span className="lang lang-cs">⬇ Stáhnout prázdnou šablonu</span>
                    <span className="lang lang-en">⬇ Download template</span>
                  </button>

                  <button
                    className="tools-dropdown-item"
                    onClick={() => {
                      onUploadJson();
                      setToolsOpen(false);
                    }}
                  >
                    <span className="lang lang-cs">⬆ Nahrát JSON</span>
                    <span className="lang lang-en">⬆ Upload JSON</span>
                  </button>

                  <button
                    className="tools-dropdown-item"
                    onClick={() => {
                      onCustom();
                      setToolsOpen(false);
                    }}
                  >
                    <span className="lang lang-cs">+ Přidat kategorii</span>
                    <span className="lang lang-en">+ Add category</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="home-button"
            onClick={onRestoreDefaults}
            type="button"
          >
            <span className="lang lang-cs">↺ Obnovit kritéria</span>
            <span className="lang lang-en">↺ Restore criteria</span>
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
              {cat.ignored ? (
                <>
                  <span className="lang lang-cs">Obnovit</span>
                  <span className="lang lang-en">Restore</span>
                </>
              ) : (
                <>
                  <span className="lang lang-cs">Ignorovat</span>
                  <span className="lang lang-en">Ignore</span>
                </>
              )}
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

            <div className="category-card-icon" aria-hidden="true">
              {getCategoryIcon(cat)}
            </div>

            {cat.ignored && (
              <p className="ignored-label">
                <span className="lang lang-cs">Tato kategorie je ignorována</span>
                <span className="lang lang-en">This category is ignored</span>
              </p>
            )}
          </div>
        ))}
      </div>

        <div className="category-footer">
  <button
    className="go-to-report-btn"
    onClick={onGoToReport}
    type="button"
  >
    <span className="lang lang-cs">Zobrazit report</span>
    <span className="lang lang-en">View report</span>
  </button>
</div>

    </>
  );
}

export default CategoryList;