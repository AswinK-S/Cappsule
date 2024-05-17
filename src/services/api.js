import axios from "axios";

const axiosApi =axios.create({
    baseURL:import.meta.env.VITE_BASE_URL, withCredentials:true
})

export {axiosApi}