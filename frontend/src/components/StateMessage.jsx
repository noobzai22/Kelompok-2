function StateMessage({ type = "empty", message, onRetry, onReset }) {
  if (type === "loading") {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <p>{message || "Memuat data..."}</p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="empty-state" role="alert">
        <p>{message || "Gagal memuat data. Periksa koneksi lalu coba lagi."}</p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Coba lagi
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state">
      <p>{message || "Belum ada laporan yang cocok."}</p>
      {onReset && (
        <button type="button" onClick={onReset}>
          Reset filter
        </button>
      )}
    </div>
  );
}

export default StateMessage;
