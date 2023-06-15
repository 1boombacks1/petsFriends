import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import '../css/swiperTinder.css'
import girl from '../img/girl.svg'
import boy from '../img/boy.svg'
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
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)
  const myRefs = useRef([])
  myRefs.current = db.map((element, i) => myRefs.current[i] ?? React.createRef())
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

  // const canGoBack = currentIndex < db.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    console.log(direction, nameToDelete, index)
    if (direction === 'left') {
      console.log(direction)
    }
    if (direction === 'right') {
      console.log(direction)
    }
    updateCurrentIndex(index - 1)
  }
  const outOfFrame = (name, idx) => {
    // console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
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
  // const goBack = async () => {
  //   if (!canGoBack) return
  //   const newIndex = currentIndex + 1
  //   updateCurrentIndex(newIndex)
  //   await childRefs[newIndex].current.restoreCard()
  // }

  const onChangeSide = (side, element) => {
    console.log(side, element)
    if (side === 'left') {
      element.classList.remove('right')
      element.classList.add('left')
    }
    if (side === 'right') {
      element.classList.remove('left')
      element.classList.add('right')
    }
  }
  const onDbClick = (element) => {
    element.children[0].children[1].classList.toggle('active')
  }

  return (
    <div className='swiperwrap'>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h2 className='infoText'>Swipe right - if you like, if not swipe left. Double Click to see description</h2>
      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            preventSwipe={['up', 'down']}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
            onSwipeRequirementFulfilled={(i) => onChangeSide(i, myRefs.current[index].current)}
          >
            <div className='cardwrap' ref={myRefs.current[index]} onDoubleClick={() => onDbClick(myRefs.current[index].current)}>
              <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                <h3>{character.name}</h3>
                <div className='description pressable'>
                  <img className='sexicon' alt='' src={false ? boy : girl} />
                  <div>
                    <h3>Обо мне</h3>
                    <p>
                      Doberman Pinscher is very sweet and affectionate with the family children, provided he has been raised with them. He views the
                      kids as the puppies in the packA Doberman Pinscher is a fantastic guard dog that will be the ultimate protector for your
                      kids.The breed originated in Germany and quickly gained popularity in
                    </p>
                  </div>
                  <div>
                    <h3>Цель</h3>
                    <p className='option'>Лютый секс</p>
                  </div>
                  <div>
                    <h3>Родословная</h3>
                    <p className='option'>Есть</p>
                  </div>
                  <div>
                    <h3>Награды</h3>
                    <p className='option award'>AFA</p>
                    <p className='option award'>AFA</p>
                  </div>
                </div>
              </div>
              <div className='buttons'>
                <div className='round-btn no' onClick={() => swipe('left')}>
                  <img alt='' src={require('../img/no.png')} />
                </div>
                <div className='round-btn yes' onClick={() => swipe('right')}>
                  <img alt='' src={require('../img/yes.png')} />
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  )
}

export default SwiperTinder
