import { useEffect, useState } from "react";
import { Link } from "react-router";
import { createReport, getLookups } from "./api/client";
import PhotoPicker from "./components/PhotoPicker";
import "./App.css";
import "./RetroForm_Stage6.css";

const CONTACT_PLACEHOLDERS = {
  WHATSAPP: "Contoh: 081234567890",
  LINE: "Contoh: faris_ui26",
  INSTAGRAM: "Contoh: faris.muhammad (tanpa @)",
  EMAIL: "Contoh: faris@ui.ac.id",
};

const CONTACT_ERROR_MESSAGES = {
  WHATSAPP: "Nomor WhatsApp harus diawali 08, 628, atau +628 (10–14 digit).",
  LINE: "ID LINE harus 3–30 karakter (huruf, angka, titik, garis bawah, atau tanda hubung).",
  INSTAGRAM: "Username Instagram harus 1–30 karakter tanpa tanda @.",
  EMAIL: "Format alamat email tidak valid (maksimal 100 karakter).",
};

function SubmitReport() {
  const [lookups, setLookups] = useState({ categories: [], locations: [] });
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [lookupError, setLookupError] = useState("");

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchLookups() {
    setLoadingLookups(true);
    setLookupError("");
    try {
      const data = await getLookups();
      setLookups({
        categories: data.categories || [],
        locations: data.locations || [],
      });
    } catch (err) {
      setLookupError(err.message || "Gagal memuat kategori dan lokasi.");
    } finally {
      setLoadingLookups(false);
    }
  }

  
  useEffect(() => {
    let active = true;

    getLookups()
      .then((data) => {
        if (!active) return;

        setLookups({
          categories: data.categories || [],
          locations: data.locations || [],
        });
      })
      .catch((err) => {
        if (active) {
          setLookupError(
            err.message || "Gagal memuat kategori dan lokasi."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoadingLookups(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);


  function validateField(name, value, currentForm = form) {
    const trimmed = typeof value === "string" ? value.trim() : value;

    if (name === "title") {
      if (!trimmed) return "Nama barang wajib diisi.";
      if (trimmed.length < 3 || trimmed.length > 100) {
        return "Nama barang harus 3–100 karakter.";
      }
    }

    if (name === "description") {
      if (!trimmed) return "Deskripsi barang wajib diisi.";
      if (trimmed.length < 10 || trimmed.length > 1000) {
        return "Deskripsi barang harus 10–1000 karakter.";
      }
    }

    if (name === "categoryId" && !trimmed) {
      return "Pilih kategori barang terlebih dahulu.";
    }

    if (name === "locationId" && !trimmed) {
      return "Pilih lokasi kejadian terlebih dahulu.";
    }

    if (name === "locationDetail" && trimmed.length > 100) {
      return "Detail lokasi maksimal 100 karakter.";
    }

    if (name === "eventDate") {
      if (!trimmed) return "Tanggal kejadian wajib diisi.";
      if (trimmed > new Date().toISOString().slice(0, 10)) {
        return "Tanggal kejadian tidak boleh di masa depan.";
      }
    }

    if (name === "contactValue") {
      if (!trimmed) return "Informasi kontak wajib diisi.";
      const method = currentForm.contactMethod;
      let valid = false;

      if (method === "WHATSAPP") {
        valid = /^(?:08\d{8,12}|(?:\+?628)\d{7,11})$/.test(trimmed);
      } else if (method === "EMAIL") {
        valid =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 100;
      } else if (method === "INSTAGRAM") {
        valid = /^[a-zA-Z0-9._]{1,30}$/.test(trimmed);
      } else if (method === "LINE") {
        valid = /^[a-zA-Z0-9._-]{3,30}$/.test(trimmed);
      }

      if (!valid) {
        return CONTACT_ERROR_MESSAGES[method];
      }
    }

    if (name === "reporterName" && trimmed.length > 50) {
      return "Nama pelapor maksimal 50 karakter.";
    }

    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);
    setError("");
    setSuccessMessage("");

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, updatedForm),
      }));
    }

    if (name === "contactMethod" && updatedForm.contactValue) {
      setFieldErrors((prev) => ({
        ...prev,
        contactValue: validateField(
          "contactValue",
          updatedForm.contactValue,
          updatedForm
        ),
      }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const message = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const fieldsToValidate = [
      "title",
      "description",
      "categoryId",
      "locationId",
      "locationDetail",
      "eventDate",
      "contactValue",
      "reporterName",
    ];

    const newErrors = {};
    let hasError = false;

    fieldsToValidate.forEach((field) => {
      const msg = validateField(field, form[field]);
      if (msg) {
        newErrors[field] = msg;
        hasError = true;
      }
    });

    setFieldErrors(newErrors);

    if (hasError) {
      setError("Periksa kembali kolom yang masih belum sesuai.");
      return;
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("categoryId", form.categoryId);
    formData.append("locationId", form.locationId);
    if (form.locationDetail.trim()) {
      formData.append("locationDetail", form.locationDetail.trim());
    }
    formData.append("eventDate", form.eventDate);
    formData.append("contactMethod", form.contactMethod);
    formData.append("contactValue", form.contactValue.trim());
    if (form.reporterName.trim()) {
      formData.append("reporterName", form.reporterName.trim());
    }
    if (photo) {
      formData.append("photo", photo);
    }

    setIsSubmitting(true);
    try {
      const result = await createReport(formData);
      setSuccessMessage(
        result?.isMock
          ? "Laporan berhasil divalidasi dan disimulasikan dalam mode mock."
          : "Laporan berhasil dikirim!"
      );
      setForm({
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
      setPhoto(null);
      setFieldErrors({});
    } catch (err) {
      if (Array.isArray(err.details) && err.details.length > 0) {
        const serverFieldErrors = {};
        err.details.forEach((item) => {
          if (item.field) {
            serverFieldErrors[item.field] = item.message;
          }
        });
        setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }));
      }
      setError(err.message || "Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="detail-page">
      <Link to="/" className="detail-back">
        ← Kembali ke daftar laporan
      </Link>

      <h1>Laporkan Barang</h1>
      <p>
        Laporkan barang hilang atau barang yang ditemukan di lingkungan
        Fasilkom UI.
      </p>

      {lookupError && (
        <div className="form-error" role="alert">
          <p>{lookupError}</p>
          <button type="button" onClick={fetchLookups}>
            Muat ulang kategori & lokasi
          </button>
        </div>
      )}

      <form className="submit-form" onSubmit={handleSubmit} noValidate>
        <label>
          Jenis laporan *
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={isSubmitting}
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
            onBlur={handleBlur}
            placeholder="Contoh: Tumbler biru"
            minLength={3}
            maxLength={100}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.title && (
            <span className="form-error">{fieldErrors.title}</span>
          )}
        </label>

        <label>
          Deskripsi barang *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jelaskan ciri-ciri barang..."
            minLength={10}
            maxLength={1000}
            rows={4}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.description && (
            <span className="form-error">{fieldErrors.description}</span>
          )}
        </label>

        <label>
          Kategori *
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loadingLookups || isSubmitting}
            required
          >
            <option value="">
              {loadingLookups ? "Memuat kategori..." : "Pilih kategori"}
            </option>
            {lookups.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId && (
            <span className="form-error">{fieldErrors.categoryId}</span>
          )}
        </label>

        <label>
          Lokasi *
          <select
            name="locationId"
            value={form.locationId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loadingLookups || isSubmitting}
            required
          >
            <option value="">
              {loadingLookups ? "Memuat lokasi..." : "Pilih lokasi"}
            </option>
            {lookups.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {fieldErrors.locationId && (
            <span className="form-error">{fieldErrors.locationId}</span>
          )}
        </label>

        <label>
          Detail lokasi (opsional)
          <input
            name="locationDetail"
            value={form.locationDetail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Contoh: Ruang A206"
            maxLength={100}
            disabled={isSubmitting}
          />
          {fieldErrors.locationDetail && (
            <span className="form-error">{fieldErrors.locationDetail}</span>
          )}
        </label>

        <label>
          Tanggal kejadian *
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            onBlur={handleBlur}
            max={new Date().toISOString().slice(0, 10)}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.eventDate && (
            <span className="form-error">{fieldErrors.eventDate}</span>
          )}
        </label>

        <label>
          Metode kontak *
          <select
            name="contactMethod"
            value={form.contactMethod}
            onChange={handleChange}
            disabled={isSubmitting}
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
            onBlur={handleBlur}
            placeholder={CONTACT_PLACEHOLDERS[form.contactMethod]}
            maxLength={100}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.contactValue && (
            <span className="form-error">{fieldErrors.contactValue}</span>
          )}
        </label>

        <p className="contact-notice">
          Kontak yang kamu isi akan ditampilkan secara publik agar pemilik atau
          penemu barang dapat menghubungimu.
        </p>

        <label>
          Nama pelapor (opsional)
          <input
            name="reporterName"
            value={form.reporterName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Kosongkan jika ingin anonim"
            maxLength={50}
            disabled={isSubmitting}
          />
          {fieldErrors.reporterName && (
            <span className="form-error">{fieldErrors.reporterName}</span>
          )}
        </label>

        <PhotoPicker
          file={photo}
          onChange={(selectedFile) => {
            setPhoto(selectedFile);
            setSuccessMessage("");
          }}
          onValidationError={(msg) => setError(msg)}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="form-success" role="status">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          className="reset-button"
          disabled={isSubmitting || loadingLookups}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
    </main>
  );
}

export default SubmitReport;