import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const registerUser = (data) => {
  return API.post("/api/auth/register", data).then(res => {

    

  
  });

};

export const loginUser = (data) => {
  return API.post("/api/auth/login", {
    email: data.emailOrPhone,
    password: data.password,
  }).then((res) => res.data);

};


export const createRestaurant = (data) => {
  const token = localStorage.getItem("token");
  return API.post("/api/restaurants", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};


export const addDish = (data) => {
  const token = localStorage.getItem("token");
  return API.post(`/api/menu/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.data);
};
