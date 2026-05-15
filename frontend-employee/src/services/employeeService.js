import API from "./api";

export const getMyProfile = async () => (await API.get("/me/profile")).data.data;
export const updateMyProfile = async (payload) =>
  (await API.put("/me/profile", payload)).data.data;
export const getMyAttendance = async (params = {}) =>
  (await API.get("/me/attendance", { params })).data.data;
export const getMySalary = async (params = {}) =>
  (await API.get("/me/salary", { params })).data.data;
export const getMyEvents = async () => (await API.get("/me/events")).data.data;
export const getMyHolidays = async () => (await API.get("/me/holidays")).data.data;
