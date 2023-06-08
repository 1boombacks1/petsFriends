import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Registration from './pages/Registration'
import Main from './pages/Main'
import Login from './pages/Login'
import RegisterPet from './pages/RegisterPet'
import Sidebar from './components/SideBar'
function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <ScrollToTop />
        <Sidebar />
        {/* <Header /> */}
        <Routes>
          <Route path='/match' element={<Main />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registerPet' element={<RegisterPet />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  )
}

export default App
