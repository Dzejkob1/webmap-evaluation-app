import { useState, useEffect, useRef } from "react";
import "./Criteria.css";

import CategoryList from "../components/criteria/CategoryList";
import CategoryDetail from "../components/criteria/CategoryDetail";
import Report from "../components/criteria/Report";
import CustomEditor from "../components/criteria/CustomEditor";

import {
  getResult,
  generateSummary,
} from "../utils/evaluationUtils";

function CriteriaPage() {
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
  const csvInputRef = useRef();

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

  const loadDefaultCategories = async () => {
    const res = await fetch(process.env.PUBLIC_URL + "/data/criteria.json");
    const data = await res.json();

    return data.map((cat) => ({
      ...cat,
      isCustom: false,
      ignored: false,
    }));
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
      } catch (err) {
        console.error("Chyba načítání JSON:", err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(categories));
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
    a.download = "criteria.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadEmptyJsonTemplate = () => {
  const template = [
    {
      category: "custom_category",
      id: "custom_category",
      title: "Název kategorie",
      description: "Popis kategorie",
      isCustom: true,
      ignored: false,
      items: [
        {
          id: 1,
          text: "Text kritéria",
          weight: 1,
          explanation: "Vysvětlení kritéria",
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
      alert("Neplatný JSON");
    }
  };

  reader.readAsText(file);
};

  const uploadCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .map((r) => r.split(","));

      const data = rows.slice(1);

      try {
        const categoriesMap = {};

        data.forEach((row) => {
          if (row.length < 7) return;

          let [
            category_id,
            category_title,
            category_description,
            item_id,
            text,
            weight,
            explanation,
          ] = row;

          if (!category_id || !text || isNaN(weight)) return;

          const safeCategoryId = "custom_" + category_id;

          if (!categoriesMap[safeCategoryId]) {
            categoriesMap[safeCategoryId] = {
              id: safeCategoryId + "_" + Date.now(),
              title: category_title || "Custom category",
              description: category_description || "",
              items: [],
              isCustom: true,
              ignored: false,
            };
          }

          categoriesMap[safeCategoryId].items.push({
            id: item_id || Date.now(),
            text,
            weight: Number(weight),
            explanation: explanation || "",
          });
        });

        const newCategories = Object.values(categoriesMap);
        setCategories((prev) => [...prev, ...newCategories]);
      } catch (err) {
        alert("Chyba při načítání CSV");
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
    if (!window.confirm("Opravdu smazat kategorii?")) return;

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
    alert("Nepodařilo se obnovit původní kategorie.");
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
  onDownloadJson={downloadJson}
  onDownloadEmptyJson={downloadEmptyJsonTemplate}
  onUploadJson={() => fileInputRef.current.click()}
  onUploadCsv={() => csvInputRef.current.click()}
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
          <input
            type="file"
            ref={csvInputRef}
            hidden
            onChange={uploadCsv}
            accept=".csv"
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
          generateSummary={() => generateSummary(activeCategories, answers)}
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