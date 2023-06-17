import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                login,
                password
            })
        });
    console.log("Получили ответ!")

    if (response.status === 404 || response.status === 400) {
      alert("Неверный логин или пароль!");
      return;
    }

    const content = await response.json()

    console.log(content)
    if (content.hasPets) {
      console.log("match")
      setRedirectTo("/match");
    } else {
      console.log("registerPet")
      setRedirectTo("/registerPet");
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo}/>;
  }

  return (
    <div className='full-center'>
      <div className='wrapper'>
        <h2>Вход</h2>
        <form onSubmit={submit}>
          <div className='input-box'>
            <input type='text' placeholder='Введи логин' required onChange={(e) => setLogin(e.target.value)}/>
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Введи пароль' required onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className='input-box button'>
            <input type='submit' value='Войти' />
          </div>
          <div className='text'>
            <h3>
              Нету аккаунта? <Link to='/registration'>Регистрируйся!</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
