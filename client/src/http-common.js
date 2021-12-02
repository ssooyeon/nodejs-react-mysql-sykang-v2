import axios from "axios";

export default axios.create({
  // baseURL: process.env.REACT_APP_API_HOST,
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-type": "application/json",
  },
});
