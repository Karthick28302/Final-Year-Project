import api from "./api";

export const getMyAttendance = async (params = {}) => {
  const { data } = await api.get("/employee/attendance", { params });
  return data;
};
