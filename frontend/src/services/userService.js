import api from "./api";

export const userSignup = (data) => {
  return api.post("/auth/signup", data);
};
export const userLogout = () => {
  return api.post("/auth/user-logout");
};
