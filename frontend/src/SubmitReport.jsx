
import { useState } from "react";
import { Link } from "react-router";
import lookups from "./data/lookups.json";
import "./App.css";

function SubmitReport() {
  const [form, setForm] = useState({
    type: "LOST",
    title: "",
    description: "",
    categoryId: "",
    locationId: "",
    locationDetail: "",
    eventDate: "",
    contactMethod: "WHATSAPP",
    contactValue: "",
    reporterName: "",
  });

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.categoryId ||
      !form.locationId ||
      !form.eventDate ||
      !form.contactValue.trim()
    ) {
      setError("Lengkapi semua kolom wajib.");
      return;
    }

    if (
      form.title.trim().length < 3 ||
      form.title.trim().length > 100 ||
      form.description.trim().length < 10
    ) {
      setError("Periksa panjang nama dan deskripsi barang.");
      return;
    }

    if (
      form.eventDate >
      new Date().toISOString().slice(0, 10)
    ) {
      setError("Tanggal kejadian tidak boleh di masa depan.");
      return;
    }

    if (
      photo &&
      !["image/jpeg", "image/png", "image/webp"].includes(
        photo.type
      )
    ) {
      setError("Foto harus JPEG, PNG, atau WebP.");
      return;
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    const contact = form.contactValue.trim();

    let validContact = false;

    if (form.contactMethod === "WHATSAPP") {
      validContact =
        /^(?:08\d{8,12}|(?:\+?628)\d{7,11})$/.test(contact);
    } else if (form.contactMethod === "EMAIL") {
      validContact =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) &&
        contact.length <= 100;
    } else if (form.contactMethod === "INSTAGRAM") {
      validContact = /^[a-zA-Z0-9._]{1,30}$/.test(contact);
    } else if (form.contactMethod === "LINE") {
      validContact = /^[a-zA-Z0-9._-]{3,30}$/.test(contact);
    }

    if (!validContact) {
      setError("Format kontak tidak sesuai dengan metode yang dipilih.");
      return;
    }

    // Simulasi pengiriman untuk frontend Checkpoint 2.
    // Integrasi POST /reports dilakukan setelah API siap.
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (photo) {
      formData.append("photo", photo);
    }

    console.log("Mock submission:", Object.fromEntries(
      formData.entries()
    ));

    setSuccess(true);
  }

  return (
    <main className="detail-page">
      <Link to="/" className="detail-back">
        ← Kembali ke daftar laporan
      </Link>

      <h1>Laporkan Barang</h1>
      <p>
        Laporkan barang hilang atau barang yang ditemukan
        di lingkungan Fasilkom UI.
      </p>

      <form className="submit-form" onSubmit={handleSubmit}>
        <label>
          Jenis laporan *
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="LOST">Barang Hilang</option>
            <option value="FOUND">Barang Ditemukan</option>
          </select>
        </label>

        <label>
          Nama barang *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Contoh: Tumbler biru"
            minLength={3}
            maxLength={100}
            required
          />
        </label>

        <label>
          Deskripsi barang *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Jelaskan ciri-ciri barang..."
            minLength={10}
            maxLength={1000}
            rows={4}
            required
          />
        </label>

        <label>
          Kategori *
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih kategori</option>
            {lookups.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Lokasi *
          <select
            name="locationId"
            value={form.locationId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih lokasi</option>
            {lookups.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Detail lokasi (opsional)
          <input
            name="locationDetail"
            value={form.locationDetail}
            onChange={handleChange}
            placeholder="Contoh: Ruang A206"
            maxLength={100}
          />
        </label>

        <label>
          Tanggal kejadian *
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
            required
          />
        </label>

        <label>
          Metode kontak *
          <select
            name="contactMethod"
            value={form.contactMethod}
            onChange={handleChange}
          >
            <option value="WHATSAPP">WhatsApp</option>
            <option value="LINE">LINE</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="EMAIL">Email</option>
          </select>
        </label>

        <label>
          Informasi kontak *
          <input
            name="contactValue"
            value={form.contactValue}
            onChange={handleChange}
            placeholder="Masukkan kontak yang dipilih"
            maxLength={100}
            required
          />
        </label>

        <p className="contact-notice">
          Kontak yang kamu isi akan ditampilkan secara
          publik agar pemilik atau penemu barang dapat
          menghubungimu.
        </p>

        <label>
          Nama pelapor (opsional)
          <input
            name="reporterName"
            value={form.reporterName}
            onChange={handleChange}
            maxLength={50}
          />
        </label>

        <label>
          Foto barang (opsional, maksimal 5 MB)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setPhoto(e.target.files?.[0] || null);
              setError("");
            }}
          />
        </label>

        {error && (
          <p className="form-error" role="alert">{error}</p>
        )}

        {success && (
          <p className="form-success" role="status">
            Form berhasil divalidasi dalam mode mock.
            Data belum dikirim ke backend.
          </p>
        )}

        <button type="submit" className="reset-button">
          Kirim Laporan
        </button>
      </form>
    </main>
  );
}

export default SubmitReport;
