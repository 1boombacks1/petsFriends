import React from 'react'
import heartMatch from '../img/heartMatch.svg'
import message from '../img/message.svg'
import { useNavigate } from 'react-router-dom';

const statucUrl = "http://localhost:4000/static";
const ModalMatch = ({matchInfo}) => {
  const navigate = useNavigate();
    return (
      <div className='modalMatch'>
        <img className='out' alt='' src={require('../img/no.png')} onClick={() => navigate(0) } />
        <h1>У вас пара!</h1>
        <div className='match'>
          <img alt='' src={statucUrl + matchInfo.userPet.photos[0].path} />
          <img alt='' src={statucUrl + matchInfo.likedPet.photos[0].path} />
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
