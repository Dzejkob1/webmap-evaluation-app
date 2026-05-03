import { useState, useEffect, useRef, useCallback } from "react";
import "./Criteria.css";

import CategoryList from "../components/criteria/CategoryList";
import CategoryDetail from "../components/criteria/CategoryDetail";
import Report from "../components/criteria/Report";
import CustomEditor from "../components/criteria/CustomEditor";

import {
  getResult,
  generateSummary,
} from "../utils/evaluationUtils";

function CriteriaPage({ lang }) {
  const currentLang = lang || localStorage.getItem("lang") || "cs";

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const [answers, setAnswers] = useState(() => {
    try {
      const savedAnswers = localStorage.getItem("criteriaAnswers");
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch {
      return {};
    }
  });

  const [customMode, setCustomMode] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const fileInputRef = useRef();
  

  const loadDefaultCategories = useCallback(async () => {
    const fileName =
      currentLang === "en"
        ? "/data/criteria_en_required.json"
        : "/data/criteria.json";

    const res = await fetch(process.env.PUBLIC_URL + fileName);
    const data = await res.json();

    return data.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.weight === 3),
      isCustom: false,
      ignored: false,
    }));
  }, [currentLang]);

  const resetCategoryAnswers = (categoryId) => {
    setAnswers((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${categoryId}-`)) {
          delete updated[key];
        }
      });

      return updated;
    });
  };

  const resetUiState = () => {
    setAnswers({});
    setSelectedCategory(null);
    setShowReport(false);
    setCurrentIndex(null);
    setOpenItems({});
    setCustomMode(false);
  };

  useEffect(() => {
    localStorage.setItem("criteriaAnswers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const init = async () => {
      try {
        const defaults = await loadDefaultCategories();
        const saved = localStorage.getItem("customCategories");

        if (!saved) {
          setCategories(defaults);
          return;
        }

        const parsed = JSON.parse(saved);

        const customCategories = parsed.filter((cat) => cat.isCustom);
        const ignoredMap = Object.fromEntries(
          parsed.map((cat) => [cat.id, !!cat.ignored])
        );

        const mergedDefaults = defaults.map((cat) => ({
          ...cat,
          ignored: ignoredMap[cat.id] ?? false,
        }));

        setCategories([...mergedDefaults, ...customCategories]);
        setSelectedCategory(null);
        setShowReport(false);
        setCurrentIndex(null);
        setOpenItems({});
      } catch (err) {
        console.error("Chyba načítání JSON:", err);
      }
    };

    init();
  }, [loadDefaultCategories]);

  useEffect(() => {
  if (categories.length === 0) return;

  const savedState = categories.map((cat) => ({
    id: cat.id,
    ignored: !!cat.ignored,
    isCustom: !!cat.isCustom,
    ...(cat.isCustom ? cat : {}),
  }));

  localStorage.setItem("customCategories", JSON.stringify(savedState));
}, [categories]);

  const setAnswer = (catId, itemId, value) => {
    const key = `${catId}-${itemId}`;

    setAnswers((prev) => {
      if (prev[key] === value) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }

      return { ...prev, [key]: value };
    });
  };

  const activeCategories = categories.filter((cat) => !cat.ignored);

  const goNext = () => {
    if (currentIndex !== null && currentIndex < activeCategories.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedCategory(activeCategories[nextIndex]);
    } else {
      setShowReport(true);
    }
  };

  const goPrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedCategory(activeCategories[prevIndex]);
    }
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = currentLang === "en" ? "criteria-en.json" : "criteria.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadEmptyJsonTemplate = () => {
    const template = [
      {
        category: "custom_category",
        id: "custom_category",
        title: currentLang === "en" ? "Category title" : "Název kategorie",
        description: currentLang === "en" ? "Category description" : "Popis kategorie",
        isCustom: true,
        ignored: false,
        items: [
          {
            id: 1,
            text: currentLang === "en" ? "Criterion text" : "Text kritéria",
            weight: 1,
            explanation: currentLang === "en" ? "Criterion explanation" : "Vysvětlení kritéria",
            links: [],
            images: [],
          },
        ],
      },
    ];

    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "criteria-template.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const uploadJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        const uploadedCategories = json.map((cat) => ({
          ...cat,
          isCustom: cat.isCustom ?? true,
          ignored: cat.ignored ?? false,
        }));

        setCategories((prev) => [...prev, ...uploadedCategories]);
        setAnswers({});
        setSelectedCategory(null);
        setShowReport(false);
        setCurrentIndex(null);
        setOpenItems({});
      } catch (err) {
        alert(currentLang === "en" ? "Invalid JSON" : "Neplatný JSON");
      }
    };

    reader.readAsText(file);
  };

  const toggleIgnoreCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, ignored: !cat.ignored } : cat
      )
    );

    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
      setCurrentIndex(null);
    }
  };

  const deleteCustomCategory = (id) => {
    const message =
      currentLang === "en"
        ? "Do you really want to delete this category?"
        : "Opravdu smazat kategorii?";

    if (!window.confirm(message)) return;

    setCategories((prev) =>
      prev.filter((cat) => !(cat.id === id && cat.isCustom))
    );

    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
      setCurrentIndex(null);
    }
  };

  const restoreDefaultCategories = async () => {
    try {
      const defaults = await loadDefaultCategories();

      setCategories((prev) => {
        const customCategories = prev.filter((cat) => cat.isCustom);
        return [...defaults, ...customCategories];
      });

      resetUiState();
    } catch (err) {
      console.error("Chyba při obnově původních kategorií:", err);
      alert(
        currentLang === "en"
          ? "Failed to restore default criteria."
          : "Nepodařilo se obnovit původní kategorie."
      );
    }
  };
  return (
    <div className="criteria-container">
      {!selectedCategory && !showReport && (
        <>
          <CategoryList
  categories={categories}
  onSelect={(cat) => {
    const index = activeCategories.findIndex((c) => c.id === cat.id);
    setSelectedCategory(cat);
    setCurrentIndex(index);
  }}
  onGoToReport={() => setShowReport(true)}
  onDownloadJson={downloadJson}
  onDownloadEmptyJson={downloadEmptyJsonTemplate}
  onUploadJson={() => fileInputRef.current.click()}
  onCustom={() => setCustomMode(true)}
  onToggleIgnore={toggleIgnoreCategory}
  onDeleteCustom={deleteCustomCategory}
  onRestoreDefaults={restoreDefaultCategories}
/>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={uploadJson}
            accept=".json"
          />


          {customMode && (
            <CustomEditor
              setCategories={setCategories}
              onClose={() => setCustomMode(false)}
            />
          )}
        </>
      )}

      {selectedCategory && !showReport && (
        <CategoryDetail
  category={selectedCategory}
  answers={answers}
  setAnswer={setAnswer}
  resetCategoryAnswers={resetCategoryAnswers}
  goNext={goNext}
  goPrev={goPrev}
  currentIndex={currentIndex}
  categories={activeCategories}
  openItems={openItems}
  setOpenItems={setOpenItems}
  getResult={(cat) => getResult(cat, answers)}
  onBack={() => {
    setSelectedCategory(null);
    setCurrentIndex(null);
  }}
/>
      )}

      {showReport && (
        <Report
          categories={activeCategories}
          answers={answers}
          getResult={(cat) => getResult(cat, answers)}
          generateSummary={() => generateSummary(activeCategories, answers, currentLang)}
          onReset={() => {
            setShowReport(false);
            setSelectedCategory(null);
            setCurrentIndex(null);
          }}
        />
      )}
    </div>
  );
}

export default CriteriaPage;