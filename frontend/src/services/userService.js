import API from "./api";

export async function registerFace(name, image) {
  const res = await API.post("/register", { name, image });
  return res.data;
}

export async function getUsers() {
  const res = await API.get("/users");
  return res.data;
}

export async function getUserDetails(userId) {
  const res = await API.get(`/users/${userId}`);
  return res.data;
}

export async function updateCompensation(userId, payload) {
  const res = await API.put(`/users/${userId}/compensation`, payload);
  return res.data;
}

export async function deleteUser(userId) {
  const res = await API.delete(`/users/${userId}`);
  return res.data;
}
