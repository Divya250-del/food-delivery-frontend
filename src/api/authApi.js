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
  return API.post("/api/restaurants", data).then((res) => res.data);
};


export const attachMenuItemToRestaurant = (data) => {
  return API.post("/api/menu/attach", data).then((res) => res.data);
};

export const getAllRestaurants = () => {
  return API.get("/api/restaurants").then((res) => res.data);
};

export const getAllMenuItems = () => {
  return API.get("/api/menu").then((res) => res.data);
};

export const getMyRestaurants = () => {
  return API.get("/api/restaurants/owner").then((res) => res.data);
};

export const getRestaurantMenu = (restaurantId) => {
  return API.get(`/api/menu/restaurant/${restaurantId}`).then((res) => res.data);
};

export const addToCart = (data) => {
  return API.post("/api/cart/add", data).then((res) => res.data);
};

export const getCart = () => {
  return API.get("/api/cart").then((res) => res.data);
};