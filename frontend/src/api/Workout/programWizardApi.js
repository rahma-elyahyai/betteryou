import { api } from "../auth";

const errorMessage = (err, fallback = "Request failed") => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    fallback;

  return typeof msg === "string" ? msg : fallback;
};

// =========================
// 1) Metadata
// =========================
export const fetchMetadata = async () => {
  try {
    const { data } = await api.get("/api/program-wizard/metadata");
    return data; // { sessionTypes, equipmentOptions, muscles }
  } catch (err) {
    throw new Error(errorMessage(err, "Failed to load metadata"));
  }
};

export const fetchSessionTypes = async () => {
  const meta = await fetchMetadata();
  return meta?.sessionTypes || [];
};

export const fetchEquipmentOptions = async () => {
  const meta = await fetchMetadata();
  return meta?.equipmentOptions || [];
};

export const fetchMuscles = async () => {
  const meta = await fetchMetadata();
  return meta?.muscles || [];
};

// =========================
// 2) Search Exercises ✅ REAL CALL
// GET /api/program-wizard/exercises/search?category=...&equipment=...&muscles=A&muscles=B
// =========================
export const searchExercises = async ({ category,  muscles }) => {
  try {
    const params = {};
    if (category) params.category = category;
    //if (equipment) params.equipment = equipment;

    if (Array.isArray(muscles) && muscles.length) {
      params.muscles = muscles.filter(Boolean);
    }

    const { data } = await api.get("/api/program-wizard/exercises/search", { params });
    return data;
  } catch (err) {
    throw new Error(errorMessage(err, "Failed to search exercises"));
  }
};
