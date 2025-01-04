import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles.css';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleError = (error) => {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Validation 1failed");
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      const response = await axios.post(
        "http://localhost:8081/api/auth/sign-in",
        formData
      ).then((response) => {
        // Сохраняем токены в localStorage
        localStorage.setItem("jwtToken", response.data.jwtToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
         
         setTimeout(() => {
          navigate("/MainPage");
        }, 1000);
      })
      .catch(handleError);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="center-container">
      <h1>Welcome to Note Keeper App</h1>
      <h2>Your personal note-taking app</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
        <button type="button" onClick={handleRegisterClick}>
          Create an Account
        </button>
      </form>
      <ToastContainer 
  position="top-right" 
  autoClose={3000} 
  hideProgressBar 
  newestOnTop 
  closeOnClick 
  rtl={false} 
  pauseOnFocusLoss 
  draggable 
  pauseOnHover 
  closeButton={<button className="toast-close-button">X</button>}
/>{/* Добавляем ToastContainer */}
    </div>
  );
};

export default LoginForm;
