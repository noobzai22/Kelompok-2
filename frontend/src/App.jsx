
import { useState } from "react";
import { Link } from "react-router";
import reports from "./data/reports.json";
import lookups from "./data/lookups.json";
import "./App.css";

const PAGE_SIZE = 12;

function App() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [page, setPage] = useState(1);

  const filteredReports = reports
    .filter((report) => {
      const matchSearch = report.title
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchType = !type || report.type === type;

      const matchCategory =
        !categoryId ||
        report.category.id === Number(categoryId);

      const matchLocation =
        !locationId ||
        report.location.id === Number(locationId);

      return (
        matchSearch &&
        matchType &&
        matchCategory &&
        matchLocation
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / PAGE_SIZE)
  );

  const visibleReports = filteredReports.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function resetFilters() {
    setSearch("");
    setType("");
    setCategoryId("");
    setLocationId("");
    setPage(1);
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Lost & Found Pacil</h1>
          <p>
            Temukan barang hilang atau laporkan
            barang yang kamu temukan di kampus.
          </p>
        </div>
        
        <div className="header-actions">
          <span className="header-label">Fasilkom UI</span>

          <Link to="/lapor" className="create-report-button">
            + Buat Laporan
          </Link>
        </div>

      </header>

      <section className="filter-section">
        <input
          type="search"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Semua jenis</option>
          <option value="LOST">Hilang</option>
          <option value="FOUND">Ditemukan</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Semua kategori</option>
          {lookups.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={locationId}
          onChange={(e) => {
            setLocationId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Semua lokasi</option>
          {lookups.locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>

        <button className="reset-button" onClick={resetFilters}>
          Reset
        </button>
      </section>

      <section className="reports-section">
        <div className="section-heading">
          <h2>Daftar Laporan</h2>
          <p>{filteredReports.length} laporan ditemukan</p>
        </div>

        {visibleReports.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada laporan yang cocok.</p>
            <button onClick={resetFilters}>Reset filter</button>
          </div>
        ) : (
          <div className="report-grid">
            {visibleReports.map((report) => (
              <article className="report-card" key={report.id}>
                <div className="report-image">
                  <span className="image-placeholder">
                    Foto barang
                  </span>

                  {report.photoUrl && (
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="card-content">
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

                  <h3>{report.title}</h3>
                  <p className="description">
                    {report.description}
                  </p>

                  <div className="report-info">
                    <p>Kategori: {report.category.name}</p>
                    <p>Lokasi: {report.location.name}</p>
                    <p>Tanggal: {report.eventDate}</p>
                  </div>

                  <Link
                    className="detail-button"
                    to={`/laporan/${report.id}`}
>
                    Lihat Detail
                  </Link>

                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </button>

          <span>
            Halaman {page} dari {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Berikutnya
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
