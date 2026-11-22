import "./ReportListSkeleton.css";

export default function ReportListSkeleton() {
  return (
    <div className="list-loading" role="status" aria-live="polite">
      <div className="list-loading-note">
        <span className="list-loading-pulse" aria-hidden="true" />
        <div>
          <strong>Menyiapkan daftar laporan...</strong>
          <p>Foto dan informasi barang sedang dimuat.</p>
        </div>
      </div>

      <div className="list-loading-grid" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div className="list-loading-card" key={index}>
            <div className="list-loading-photo">
              <span className="list-loading-photo-symbol" />
            </div>

            <div className="list-loading-card-body">
              <span className="list-loading-bar list-loading-badge" />
              <span className="list-loading-bar list-loading-title" />
              <span className="list-loading-bar list-loading-description" />
              <span className="list-loading-bar list-loading-description is-short" />
              <div className="list-loading-separator" />
              <span className="list-loading-bar list-loading-meta" />
              <span className="list-loading-bar list-loading-meta is-medium" />
              <span className="list-loading-bar list-loading-meta is-short" />
              <span className="list-loading-bar list-loading-button" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
