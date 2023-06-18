import '../css/likes.css'
import x from '../img/x.svg'
import heart from '../img/heart.png'
import ModalMatch from '../components/ModalMatch'
const candidates = [
  { img: require('../img/petsForLikes/dog1.jpg'), name: 'Tori' },
  { img: require('../img/petsForLikes/dog2.jpeg'), name: 'Yaya' },
  { img: require('../img/petsForLikes/dog3.jpg'), name: 'Joy' },
  { img: require('../img/petsForLikes/dog3.jpg'), name: 'Nana' },
  { img: require('../img/petsForLikes/dog1.jpg'), name: 'Alex' },
  { img: require('../img/petsForLikes/dog2.jpeg'), name: 'Tom' },
]

const Likes = () => {
  return (
    <div className='content' style={{ paddingTop: 75 }}>
      {true && <ModalMatch />}
      <h2>Питомцы, которым вы приглянулись</h2>
      <div className='flex wrap petsbox'>
        {candidates.map((item) => (
          <div key={item.name} className='candidate'>
            <img alt='' src={item.img} />
            <h3>{item.name}</h3>
            <div style={{ display: 'flex' }}>
              <button>
                <img alt='' src={x} />
              </button>
              <button>
                <img alt='' src={heart} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>Ваши лайки</h2>
      <div className='flex wrap petsbox'>
        {candidates.map((item) => (
          <div key={item.name} className='likes'>
            <img alt='' src={item.img} />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Likes
