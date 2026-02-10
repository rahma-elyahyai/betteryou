
import { api } from "../auth";



export const fetchWorkouts = async () => {
  const response = api.get(`/api/workouts`);
  return response.data;
};

export const fetchWorkoutDetail = async (id) => {
  const response = api.get(`/api/workouts/${id}/detail`);
  return response.data;
};
