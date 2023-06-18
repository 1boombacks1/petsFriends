import '../css/likes.css'
import x from '../img/x.svg'
import heart from '../img/heart.png'
import ModalMatch from '../components/ModalMatch'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const static_url = 'http://localhost:4000/static'

const Likes = () => {
  const navigate = useNavigate()
  const [likedPets, setLikedPets] = useState([])
  const [petsLikedUserPet, setPetsLikedUserPet] = useState([])
  const [matchInfo, setMatchInfo] = useState({"isMatch" : false})

  const [newIsMatch, setNewIsMatch] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/user/getLikeAndLikedPets", {
        credentials : "include",
      })
      const data = await response.json()
      return data
    }

    fetchData().then((data) => {
      setLikedPets(data.likedPets)
      setPetsLikedUserPet(data.petsLikedUserPet)
    })
  },[])

  const clickLike = (petId) => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/user/likePet", {
        method: 'POST',
          credentials: 'include',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            ID: petId,
          })
      })
      if (response.status === 200) {
        return await response.json()
      } else {
        alert("Произошла ошибка на сервере")
        return "err"
      }
    }

    fetchData().then((data) => {
      if (data === "err") {
        return
      }
      setMatchInfo(data)
      setNewIsMatch(true)
    })
  }

  const clickDislike =(petId) => {
    const fetchData = async () => {
      await fetch("http://localhost:4000/api/user/dislikePet", {
        method: 'POST',
          credentials: 'include',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            dislikedPetId: petId,
          })
      })
  }
  fetchData()
}

const checkProfileClick = (petId) => {
  navigate("/profile/"+petId)
}

  return (
    <div className='content' style={{ paddingTop: 75 }}>
      {newIsMatch && <ModalMatch matchInfo={matchInfo} setNewIsMatch={setNewIsMatch}/>}
      <h2>Питомцы, которым вы приглянулись</h2>
      <div className='flex wrap petsbox'>
        {petsLikedUserPet.map((pet) => (
          <div key={pet.ID} className='candidate'>
            <img alt='' src={static_url + pet.photos[0].path} onClick={() => checkProfileClick(pet.ID)}/>
            <h3>{pet.name}</h3>
            <div style={{ display: 'flex' }}>
              <button onClick={() => clickDislike(pet.ID)}>
                <img alt='' src={x} />
              </button>
              <button onClick={() => clickLike(pet.ID)}>
                <img alt='' src={heart} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>Ваши лайки</h2>
      <div className='flex wrap petsbox'>
        {likedPets.map((pet) => (
          <div key={pet.ID} className='likes' onClick={() => checkProfileClick(pet.ID)}>
            <img alt='' src={static_url + pet.photos[0].path} />
            <h3>{pet.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Likes
