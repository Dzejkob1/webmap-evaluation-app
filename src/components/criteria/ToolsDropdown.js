function ToolsDropdown({
  downloadJson,
  uploadJson,
  uploadCsv,
  downloadCsvTemplate,
  fileInputRef,
  csvInputRef
}) {
  return (
    <div className="tools-menu">

      <button onClick={downloadJson}>⬇ JSON</button>
      <button onClick={downloadCsvTemplate}>⬇ CSV</button>

      <button onClick={() => fileInputRef.current.click()}>
        ⬆ JSON
      </button>

      <button onClick={() => csvInputRef.current.click()}>
        ⬆ CSV
      </button>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={uploadJson}
      />

      <input
        type="file"
        ref={csvInputRef}
        hidden
        onChange={uploadCsv}
      />

    </div>
  );
}

export default ToolsDropdown;