import React from 'react'
import SwiperTinder from '../components/SwiperTinder'
import Sidebar from '../components/SideBar'
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'

const Main = () => {
  return (
    <div className='content sb' style={{padding: 0}}>
      <SwiperTinder />
      <div style={{ width: '100%' }}>
        {/* <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >
          <SwiperSlide>
            <img alt='' src={require('../img/full-pets/image5.png')} />
          </SwiperSlide>
          <SwiperSlide>
            <img alt='' src={require('../img/full-pets/image5.png')} />
          </SwiperSlide>
          <SwiperSlide>
            <img alt='' src={require('../img/full-pets/image5.png')} />
          </SwiperSlide>
          <SwiperSlide>
            <img alt='' src={require('../img/full-pets/image5.png')} />
          </SwiperSlide>
          ...
        </Swiper> */}
      </div>
    </div>
  )
}

export default Main
