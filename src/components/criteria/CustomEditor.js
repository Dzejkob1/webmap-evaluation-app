import { useState } from "react";

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
        placeholder="Název kategorie"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {rows.map((row, i) => (
        <div key={i} className="custom-row">
          <input
            placeholder="Kritérium"
            value={row.text}
            onChange={(e) => updateRow(i, "text", e.target.value)}
          />
          <input
            type="number"
            value={row.weight}
            onChange={(e) => updateRow(i, "weight", e.target.value)}
          />
          <input
            placeholder="Popis"
            value={row.explanation}
            onChange={(e) => updateRow(i, "explanation", e.target.value)}
          />
        </div>
      ))}

      <button className="home-button" onClick={addRow}>
        + řádek
      </button>
      <button className="home-button" onClick={save}>
        Uložit
      </button>
    </div>
  );
}

export default CustomEditor;