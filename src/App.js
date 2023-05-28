import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Registration from './pages/Registration'
import Main from './pages/Main'
import Login from './pages/Login'
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <ScrollToTop />
        {/* <Header /> */}
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  )
}

export default App
