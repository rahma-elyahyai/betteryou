
import { api } from "../auth";

export const fetchWorkouts = async () => {
  const response = await api.get(`/api/workouts`);
  return response.data;
};

export const fetchWorkoutDetail = async (id) => {
  const response = await api.get(`/api/workouts/${id}/detail`);
  return response.data;
};
