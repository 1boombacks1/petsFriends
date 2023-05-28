import React from 'react'
import { Link } from 'react-router-dom'

const Registration = () => {
  return (
    <div className='full-center'>
      <div className='wrapper'>
        <h2>Регистрация</h2>
        <form action='/register' method='post'>
          <div className='input-box'>
            <input name='login' type='text' placeholder='Введи логин' required />
          </div>
          <div className='input-box'>
            <input name='password' type='password' placeholder='Придумай пароль' required />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Подтверди пароль' required />
          </div>
          <div className='policy'>
            <input type='checkbox' />
            <h3>I accept all terms & condition</h3>
          </div>
          <div className='input-box button'>
            <input type='submit' value='Зарегистрироваться' />
          </div>
          <div className='text'>
            <h3>
              Уже есть аккаунт? <Link to='/login'>Заходи, не стесняйся</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registration
