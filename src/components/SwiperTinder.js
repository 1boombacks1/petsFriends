import React, { useState, useMemo, useRef, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import '../css/swiperTinder.css'
import girl from '../img/girl.svg'
import boy from '../img/boy.svg'
import { useNavigate } from 'react-router-dom'

const static_url = 'http://localhost:4000/static'

function SwiperTinder() {
  const navigate = useNavigate()
  const [suitablePets, setSuitablePets] = useState([
    {
      ID: 0,
      name: '',
      photos: [{ path: '' }],
      aboutMeInfo: '',
      isMating: false,
      pedigree: false,
      awards: [{ name: '' }],
      likedPets: [],
      dislikePets: [],
    },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(currentIndex)
  const myRefs = useRef([])
  myRefs.current = suitablePets.map((element, i) => myRefs.current[i] ?? React.createRef())
  const childRefs = useMemo(
    () =>
      Array(suitablePets.length)
        .fill(0)
        .map((i) => React.createRef()),
    [suitablePets]
  )

  useEffect(() => {
    const fetchSuitablePets = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/getSuitablePets', {
          credentials: 'include',
        })

        if (response.status === 401) {
          navigate('/login')
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching petInfo:', error)
      }
    }

    fetchSuitablePets().then((data) => {
      if (data === null) {
        return
      }
      setSuitablePets(data);
      setCurrentIndex(data.length - 1);
    });
  }, [navigate]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, petId, index) => {
    if (direction === 'left') {
      const likePet = async () => {
        await fetch('http://localhost:4000/api/user/dislikePet', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            dislikedPetId: petId,
          }),
        })
      }
      likePet()
    }
    if (direction === 'right') {
      const dislikePet = async () => {
        const response = await fetch('http://localhost:4000/api/user/likePet', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            ID: petId,
          }),
        })
        const isMatch = response.json()
        console.log(isMatch)
      }
      dislikePet()
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
    if (canSwipe && currentIndex < suitablePets.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  const onChangeSide = (side, element) => {
    element.children[0].children[1].classList.remove("active");
    if (side === "left") {
      element.classList.remove("right");
      element.classList.add("left");
    }
    if (side === 'right') {
      element.classList.remove('left')
      element.classList.add('right')
    }
  }
  const onDbClick = (element) => {
    element.children[0].children[1].classList.toggle('active')
  }

  const formatAge = (age) => {
    if (age % 10 === 1 && age !== 11) {
      return age + ' год'
    } else if (age % 10 > 1 && age % 10 < 5 && !(age > 10 && age < 15)) {
      return age + ' года'
    } else {
      return age + ' лет'
    }
  }

  return (
    <div className='swiperwrap'>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      {/* <button className="round-btn" onClick={()=>(console.log(suitablePets[0].LikedPets))}/> */}
      <h2 className='infoText'>Swipe right - if you like, if not swipe left. Double Click to see description</h2>
      <div className='swipeflex'>
        <div className='bigword'>NO</div>
        <div className='cardContainer'>
          {suitablePets.map((pet, index) => (
            <TinderCard
              ref={childRefs[index]}
              className='swipe'
              key={pet.ID}
              preventSwipe={['up', 'down']}
              onSwipe={(dir) => swiped(dir, pet.ID, index)} //Зачем?
              onCardLeftScreen={() => outOfFrame(pet.name, index)} //Зачем?
              onSwipeRequirementFulfilled={(i) => onChangeSide(i, myRefs.current[index].current)}
            >
              <div className='cardwrap' ref={myRefs.current[index]} onDoubleClick={() => onDbClick(myRefs.current[index].current)}>
                <div
                  style={{
                    backgroundImage: 'url(' + static_url + pet.photos[0].path + ')',
                  }}
                  className='card'
                >
                  <h3>
                    {pet.name}, {formatAge(pet.age)}
                  </h3>
                  <div className='description pressable'>
                    <img className='sexicon' alt='' src={pet.sex ? boy : girl} />
                    <div>
                      <h3>Обо мне</h3>
                      <p>{pet.aboutMeInfo}</p>
                    </div>
                    <div>
                      <h3>Цель</h3>
                      <p className='option'>{pet.isMating ? 'Вязка' : 'Найти друзей'}</p>
                    </div>
                    <div>
                      <h3>Родословная</h3>
                      <p className='option'>{pet.pedigree ? 'Есть' : 'Нет'}</p>
                    </div>
                    <div>
                      <h3>Награды</h3>
                      {pet.awards.length > 0 ? (
                        pet.awards.map((award, i) => (
                          <p key={i} className='option award'>
                            {award.name}
                          </p>
                        ))
                      ) : (
                        <p className='option'>Нет</p>
                      )}
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
        <div className='bigword'>YES</div>
      </div>
    </div>
  )
}

export default SwiperTinder
