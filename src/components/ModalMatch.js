import React from 'react'
import heartMatch from '../img/heartMatch.svg'
import message from '../img/message.svg'
import { useNavigate } from 'react-router-dom';

//https://t.me/boombacks
const server_url = process.env.REACT_APP_SERVER_URL
const statuc_url = server_url + "/static";
const ModalMatch = ({matchInfo}) => {
  const navigate = useNavigate();
    return (
      <div className='modalMatch'>
        <img className='out' alt='' src={require('../img/no.png')} onClick={() => navigate(0) } />
        <h1>У вас пара!</h1>
        <div className='match'>
          <img alt='' src={statuc_url + matchInfo.userPet.photos[0].path} />
          <img alt='' src={statuc_url + matchInfo.likedPet.photos[0].path} />
          <div className='heart'>
            <img alt='' src={heartMatch} />
          </div>
        </div>
        <a href={matchInfo.contact} target='_blank' rel='noreferrer' className='message'>
          <img alt='' src={message} />
          <span>Написать сообщение</span>
        </a>
      </div>
    )
  }

export default ModalMatch
