import api from "./api";

export const getMySalary = async (params = {}) => {
  const { data } = await api.get("/employee/salary", { params });
  return data;
};
