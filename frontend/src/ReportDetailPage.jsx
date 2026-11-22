
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getReport } from "./api/client.js";
import "./App.css";

function ReportDetail() {
  const { id } = useParams();

  const [result, setResult] = useState({
    id: null,
    report: null,
    error: "",
  });

  const [failedImageId, setFailedImageId] = useState(null);

  useEffect(() => {
    let active = true;

    getReport(id)
      .then((response) => {
        if (!active) return;

        setResult({
          id,
          report: response.data ?? null,
          error: "",
        });
      })
      .catch((err) => {
        if (!active) return;

        setResult({
          id,
          report: null,
          error: err.message || "Gagal memuat laporan.",
        });
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (result.id !== id) {
    return (
      <main className="detail-page">
        <p>Memuat detail laporan...</p>
      </main>
    );
  }

  if (result.error || !result.report) {
    return (
      <main className="detail-page">
        <h1>Detail laporan tidak tersedia</h1>
        <p role="alert">
          {result.error || "Laporan tidak ditemukan."}
        </p>
        <Link to="/">Kembali ke daftar laporan</Link>
      </main>
    );
  }

  const report = result.report;

  return (
    <main className="detail-page">
      <Link to="/" className="detail-back">
        ← Kembali ke daftar laporan
      </Link>

      <article className="detail-card">
        <div className="detail-image">
          {report.photoUrl && failedImageId !== id ? (
            <img
              src={report.photoUrl}
              alt={report.title}
              onError={() => setFailedImageId(id)}
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

          <p>Kategori: {report.category?.name ?? "-"}</p>
          <p>Lokasi: {report.location?.name ?? "-"}</p>

          {report.locationDetail && (
            <p>Detail lokasi: {report.locationDetail}</p>
          )}

          <p>Tanggal kejadian: {report.eventDate}</p>
          <p>Status: {report.status ?? "Belum tersedia"}</p>

          <h2>Kontak Pelapor</h2>

          <p>Metode: {report.contactMethod}</p>
          <p>Kontak: {report.contactValue}</p>
        </div>
      </article>
    </main>
  );
}

export default ReportDetail;
