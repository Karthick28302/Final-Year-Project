import api from "./api";

export const getEvents = async () => {
  const { data } = await api.get("/employee/events");
  return data;
};
