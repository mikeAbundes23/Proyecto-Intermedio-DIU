import axios from 'axios';

const api_url = process.env.REACT_APP_API_URL;

// Función para hacer login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${api_url}/api/user/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Error al hacer login:', error);
    throw error;
  }
};

// Función de prueba
export const test = async (username,password) => {
    try {
      console.log(api_url);
      const response = await axios.post(`${api_url}/auth/login`, {
        username: 'emilys',
        password: 'emilyspass',
      });
      return response.data;
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw error;
    }
  };
  
