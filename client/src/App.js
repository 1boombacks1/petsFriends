import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Registration from './pages/Registration'
import Main from './pages/Main'
import Login from './pages/Login'
import RegisterPet from './pages/RegisterPet'
import Sidebar from './components/SideBar'
import MyProfile from './pages/MyProfile'
import ProfilePet from './pages/ProfilePet'
import Likes from './pages/Likes'
function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <ScrollToTop />
        <Sidebar />
        {/* <Header /> */}
        <Routes>
          <Route path='/' element={<Navigate to={"/login"}/>} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registerPet' element={<RegisterPet />} />
          <Route path='/match' element={<Main />} />
          <Route path='/profile/:id' element={<ProfilePet/> }/>
          <Route path='/profile' element={<MyProfile />} />
          <Route path='/likes' element={<Likes />} />
          {/* <Route path='/messages' element={<Profile />} /> */}
          <Route path="*" element={<h2>Ресурс не найден!</h2>}/>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  )
}

export default App
