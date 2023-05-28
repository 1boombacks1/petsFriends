import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='full-center'>
      <div className='wrapper'>
        <h2>Вход</h2>
        <form action='#'>
          <div className='input-box'>
            <input type='text' placeholder='Введи логин' required />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Введи пароль' required />
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
