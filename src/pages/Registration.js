import React, { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const server_url = process.env.REACT_APP_SERVER_URL

const Registration = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async() => {
      const response = await fetch(server_url + "/auth/checker", {
        credentials: "include",
      })
      if (response.status === 403) {
        alert("Вы уже авторизованы 😘")
        navigate("/match")
      }
    }
    checkAuth()
  })

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return; // Прекратить выполнение функции в случае несовпадения паролей
    }

    const response = await fetch(server_url + "/auth/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name,
        login,
        password,
        contact
      }),
    });

    const content = await response.json();

    if (content.status === "ok") {
      setRegistered(true);
    } else if (content.status === "loginExist") {
      alert("Пользователь с таким именем уже существует!");
    }
  };

  if (registered) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="full-center">
      <div className="wrapper">
        <h2>Регистрация</h2>
        <form onSubmit={submit}>
        <div className="input-box">
            <input
              name="name"
              type="text"
              placeholder="Введите имя"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              name="login"
              type="text"
              placeholder="Введи логин"
              required
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              name="contact"
              type="url"
              placeholder="Контакт(tg,vk,insta,whatsapp)"
              required
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              name="password"
              type="password"
              placeholder="Придумай пароль"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Подтверди пароль"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {!passwordMatch && <p>Пароли не совпадают!</p>}
          <div className="policy">
            <input type="checkbox" />
            <h3>Я подтверждаю, что люблю котят и щеночков!</h3>
          </div>
          <div className="input-box button">
            <input type="submit" value="Зарегистрироваться" />
          </div>
          <div className="text">
            <h3>
              Уже есть аккаунт? <Link to="/login">Заходи, не стесняйся</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
