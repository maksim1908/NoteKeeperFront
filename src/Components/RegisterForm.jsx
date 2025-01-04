import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import '../styles.css';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
  });
  const [registerResponse, setRegisterResponse] = useState(null);
  const navigate = useNavigate(); // Создаем объект navigate для перехода

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Validation failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        formData, // Отправляем данные формы
        {
          headers: {
            "Content-Type": "application/json", // Указываем, что данные отправляются в формате JSON
          },
        }
      ).then(()=>{
        setRegisterResponse(response.data); // Ответ сервера, если регистрация успешна
        alert("Регистрация успешна");
        toast.success("Регистрация успешна");
        // После успешной регистрации, перенаправляем на страницу входа
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }).catch(handleError);
  };

  const handleGoToLogin = () => {
    navigate("/login"); // Переход на страницу входа
  };

  return (
    <div className="center-container">
    <h1>Welcome to Note Keeper App</h1> {/* Приветствие с названием приложения */}
    <h2>Your personal note-taking app</h2> {/* Подзаголовок с описанием */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        <button onClick={handleGoToLogin}>Go to Login</button> {/* Кнопка для перехода на форму входа */}
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
        closeButton={<button className="toast-close-button">X</button>}/>
      {registerResponse && (
        <div>
          <h3>Registration Response</h3>
          <p>Username: {registerResponse.username}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;