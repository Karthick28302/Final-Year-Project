import API from "./api";

export async function registerFace(name, image) {
  const res = await API.post("/register", { name, image });
  return res.data;
}
