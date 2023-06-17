import React from 'react'
import heartMatch from '../img/heartMatch.svg'
import message from '../img/message.svg'
const ModalMatch = () => {
  return (
    <div className='modalMatch'>
      <img className='out' alt='' src={require('../img/no.png')} />
      <h1>У вас пара!</h1>
      <div className='match'>
        <img alt='' src={require('../img/petsForLikes/dog1.jpg')} />
        <img alt='' src={require('../img/petsForLikes/dog3.jpg')} />
        <div className='heart'>
          <img alt='' src={heartMatch} />
        </div>
      </div>
      <a href='#' target='_blank' className='message'>
        <img alt='' src={message} />
        <span>Write a message</span>
      </a>
    </div>
  )
}

export default ModalMatch
