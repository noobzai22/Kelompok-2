import { useEffect, useRef, useState } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function PhotoPicker({ file, onChange, onValidationError }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    if (!selected) {
      onChange(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      onValidationError?.("Format foto harus JPEG, PNG, atau WebP.");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      onValidationError?.("Ukuran foto maksimal 5 MB.");
      e.target.value = "";
      return;
    }

    onValidationError?.("");
    onChange(selected);
  }

  function handleRemove() {
    onChange(null);
    onValidationError?.("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="photo-picker">
      <label>
        Foto barang (opsional, JPEG/PNG/WebP, maks 5 MB)
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
      </label>

      {previewUrl && (
        <div
          style={{
            marginTop: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "0.75rem",
            background: "#f9fafb",
          }}
        >
          <img
            src={previewUrl}
            alt="Pratinjau foto barang"
            style={{
              width: "100%",
              maxWidth: "320px",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: "6px",
              display: "block",
            }}
          />
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>
              {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #dc2626",
                background: "#fff",
                color: "#dc2626",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Hapus Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoPicker;