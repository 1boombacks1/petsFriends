import React from 'react'
import Header from '../components/Header'
import SwiperTinder from '../components/SwiperTinder'
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'

const Main = () => {
  return (
    <div className='content sb'>
      <Header />
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
