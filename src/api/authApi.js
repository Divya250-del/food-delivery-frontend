import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export const registerUser = (data) => {
  return API.post("/api/auth/register", data).then(res => {

    

  
  });

};