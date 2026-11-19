import mockLookups from "../data/lookups.json";
import mockReports from "../data/reports.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseApiResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      payload?.error?.message || "Terjadi kesalahan saat menghubungi server."
    );
    error.code = payload?.error?.code || "INTERNAL_ERROR";
    error.details = payload?.error?.details || [];
    throw error;
  }
  return payload;
}

export async function getLookups() {
  if (USE_MOCK) {
    await delay(150);
    return mockLookups;
  }

  const [catRes, locRes] = await Promise.all([
    fetch(`${API_BASE_URL}/categories`),
    fetch(`${API_BASE_URL}/locations`),
  ]);

  const catPayload = await parseApiResponse(catRes);
  const locPayload = await parseApiResponse(locRes);

  return {
    categories: catPayload.data || [],
    locations: locPayload.data || [],
  };
}

export async function getReports(params = {}) {
  if (USE_MOCK) {
    await delay(200);
    const {
      q = "",
      type = "",
      categoryId = "",
      locationId = "",
      page = 1,
      pageSize = 12,
    } = params;

    const filtered = mockReports
      .filter((report) => {
        const matchSearch =
          !q.trim() ||
          report.title.toLowerCase().includes(q.toLowerCase().trim()) ||
          report.description.toLowerCase().includes(q.toLowerCase().trim());
        const matchType = !type || report.type === type;
        const matchCategory =
          !categoryId || report.category.id === Number(categoryId);
        const matchLocation =
          !locationId || report.location.id === Number(locationId);

        return matchSearch && matchType && matchCategory && matchLocation;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, Number(page)), totalPages);
    const data = filtered.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return {
      data,
      meta: {
        page: currentPage,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE_URL}/reports?${query.toString()}`);
  return parseApiResponse(response);
}

export async function getReport(id) {
  if (USE_MOCK) {
    await delay(150);
    const found = mockReports.find((item) => item.id === Number(id));
    if (!found) {
      const error = new Error("Laporan tidak ditemukan.");
      error.code = "NOT_FOUND";
      throw error;
    }
    return { data: found };
  }

  const response = await fetch(`${API_BASE_URL}/reports/${id}`);
  return parseApiResponse(response);
}

export async function createReport(formData) {
  if (USE_MOCK) {
    await delay(400);
    const categoryId = Number(formData.get("categoryId"));
    const locationId = Number(formData.get("locationId"));
    const photoFile = formData.get("photo");

    const category = mockLookups.categories.find(
      (c) => c.id === categoryId
    ) || { id: categoryId, name: "Lainnya" };

    const location = mockLookups.locations.find(
      (l) => l.id === locationId
    ) || { id: locationId, name: "Lokasi Kampus" };

    return {
      data: {
        id: Date.now(),
        type: formData.get("type"),
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        category,
        location,
        locationDetail:
          String(formData.get("locationDetail") || "").trim() || null,
        eventDate: formData.get("eventDate"),
        photoUrl:
          photoFile && photoFile.size > 0
            ? URL.createObjectURL(photoFile)
            : null,
        contactMethod: formData.get("contactMethod"),
        contactValue: String(formData.get("contactValue") || "").trim(),
        reporterName: String(formData.get("reporterName") || "").trim() || null,
        createdAt: new Date().toISOString(),
      },
      isMock: true,
    };
  }

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    body: formData,
  });
  return parseApiResponse(response);
}