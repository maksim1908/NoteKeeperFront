import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Для навигации
import axios from "axios";
import '../styles.css';

const LoginForm = () => {
  const navigate = useNavigate(); // Хук для навигации
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginResponse, setLoginResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/sign-in",
        formData
      );
      // Сохраняем токены в localStorage
      localStorage.setItem("jwtToken", response.data.jwtToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      setLoginResponse(response.data); // Можно оставить для проверки в будущем, но выводить не будем
      alert("Авторизация успешна");
      navigate("/MainPage"); // Переход на защищенную страницу после авторизации
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert("Ошибка авторизации");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Переход на страницу регистрации
  };

  return (
    <div className="center-container">
      <h1>Welcome to Note Keeper App</h1> {/* Приветствие с названием приложения */}
      <h2>Your personal note-taking app</h2> {/* Подзаголовок с описанием */}
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
        <button onClick={handleRegisterClick}>Create an Account</button> {/* Кнопка для перехода на регистрацию */}
      </form>
    </div>
  );
};

export default LoginForm;
