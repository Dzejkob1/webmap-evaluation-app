import { useState } from "react";
const currentLang = localStorage.getItem("lang") || "cs";

function CustomEditor({ setCategories, onClose }) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([{ text: "", weight: 1, explanation: "" }]);

  const addRow = () => {
    setRows([...rows, { text: "", weight: 1, explanation: "" }]);
  };

  const updateRow = (i, field, val) => {
    const copy = [...rows];
    copy[i][field] = val;
    setRows(copy);
  };

  

  const save = () => {
    const newCat = {
      id: "custom-" + Date.now(),
      title: name || "Custom category",
      description: "Uživatelská kritéria",
      isCustom: true,
      ignored: false,
      items: rows
        .filter((r) => r.text.trim() !== "")
        .map((r, i) => ({
          id: i + 1,
          text: r.text,
          weight: Number(r.weight),
          explanation: r.explanation,
          links: [],
          images: [],
        })),
    };

    setCategories((prev) => [...prev, newCat]);
    onClose();
  };

  return (
    <div className="custom-editor">
      <input
        placeholder={currentLang === "en" ? "Category name" : "Název kategorie"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {rows.map((row, i) => (
  <div key={i} className="custom-row">
    <input
      placeholder={
        currentLang === "en" ? "Criterion" : "Kritérium"
      }
      value={row.text}
      onChange={(e) => updateRow(i, "text", e.target.value)}
    />

    <select
  value={row.weight}
  onChange={(e) => updateRow(i, "weight", Number(e.target.value))}
>
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>
    {currentLang === "en" ? "3 – mandatory" : "3 – povinné"}
  </option>
</select>

    <input
      placeholder={
        currentLang === "en" ? "Description" : "Popis"
      }
      value={row.explanation}
      onChange={(e) => updateRow(i, "explanation", e.target.value)}
    />
  </div>
))}

      <button className="home-button" onClick={addRow}>
  {currentLang === "en" ? "+ row" : "+ řádek"}
</button>

<button className="home-button" onClick={save}>
  {currentLang === "en" ? "Save" : "Uložit"}
</button>
    </div>
  );
}

export default CustomEditor;