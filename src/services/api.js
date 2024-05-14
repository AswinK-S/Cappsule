import axios from "axios";

const axiosApi =axios.create({
    baseURL:'https://backend.cappsule.co.in/', withCredentials:true
})

export {axiosApi}