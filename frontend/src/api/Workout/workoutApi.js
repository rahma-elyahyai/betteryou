import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchWorkouts = async () => {
  const response = await axios.get(`${API_BASE_URL}/workouts`);
  return response.data;
};

export const fetchWorkoutDetail = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/workouts/${id}/detail`);
  return response.data;
};
