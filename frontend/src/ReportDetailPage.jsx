
import { useState } from "react";
import { useParams, Link } from "react-router";
import reports from "./data/reports.json";
import "./App.css";

function ReportDetail() {
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);

  const report = reports.find((item) => item.id === id);

  if (!report) {
    return (
      <main className="detail-page">
        <h1>Laporan tidak ditemukan</h1>
        <Link to="/">Kembali ke daftar laporan</Link>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <Link to="/" className="detail-back">
        ← Kembali ke daftar laporan
      </Link>

      <article className="detail-card">
        <div className="detail-image">
          {report.photoUrl && !imageError ? (
            <img
              src={report.photoUrl}
              alt={report.title}
              onError={() => setImageError(true)}
            />
          ) : (
            <span>Foto barang tidak tersedia</span>
          )}
        </div>

        <div className="detail-content">
          <span
            className={
              report.type === "LOST"
                ? "badge lost"
                : "badge found"
            }
          >
            {report.type === "LOST"
              ? "Hilang"
              : "Ditemukan"}
          </span>

          <h1>{report.title}</h1>
          <p>{report.description}</p>

          <h2>Informasi Barang</h2>

          <p>Kategori: {report.category.name}</p>
          <p>Lokasi: {report.location.name}</p>

          {report.locationDetail && (
            <p>Detail lokasi: {report.locationDetail}</p>
          )}

          <p>Tanggal kejadian: {report.eventDate}</p>
          <p>Status: {report.status}</p>

          <h2>Kontak Pelapor</h2>

          <p>Metode: {report.contactMethod}</p>
          <p>Kontak: {report.contactValue}</p>
        </div>
      </article>
    </main>
  );
}

export default ReportDetail;
