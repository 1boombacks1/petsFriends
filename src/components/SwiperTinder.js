import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import '../css/swiperTinder.css'
const db = [
  {
    name: 'Alexa, 3 y.o',
    url: './img/full-pets/image5.png',
  },
  {
    name: 'Erlich Bachman',
    url: './img/full-pets/image5.png',
  },
  {
    name: 'Monica Hall',
    url: './img/full-pets/image5.png',
  },
  {
    name: 'Jared Dunn',
    url: './img/full-pets/image5.png',
  },
  {
    name: 'Alex, 4 y.o',
    url: './img/full-pets/image5.png',
  },
]

function SwiperTinder() {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction === 'left' ? 'влево' : 'вправо')
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div className='swiperwrap'>
      <div>
        <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
        {lastDirection ? (
          <h2 key={lastDirection} className='infoText'>
            Вы свайпнули {lastDirection}
          </h2>
        ) : (
          <h2 className='infoText'>Swipe right if you like if not swipe left</h2>
        )}
        <div className='cardContainer'>
          {db.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className='swipe'
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name, index)}
              onCardLeftScreen={() => outOfFrame(character.name, index)}
            >
              <div className='cardwrap'>
                <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                  <h3>{character.name}</h3>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
        <div className='buttons'>
          <div className='round-btn no' onClick={() => swipe('left')}>
            <img alt='' src={require('../img/no.png')} />
          </div>
          {/* <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>
            Undo swipe!
          </button> */}
          <div className='round-btn yes' onClick={() => swipe('right')}>
            <img alt='' src={require('../img/yes.png')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwiperTinder
