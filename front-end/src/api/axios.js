import axios from 'axios';

const api = axios.create({
  // Ajusta esta URL según tu estructura local en XAMPP
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;