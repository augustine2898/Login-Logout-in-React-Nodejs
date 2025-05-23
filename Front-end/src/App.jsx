// App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/User-side/Home'
import Login from './pages/User-side/Login'
import EmailVerify from './pages/User-side/EmailVerify'
import ResetPassword from './pages/User-side/ResetPassword'
import Profile from './pages/User-side/Profile'
import AdminLogin from './pages/Admin-side/Login'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuthState } from './features/authSlice'
import { fetchAdminAuthState } from './features/adminSlice'
import 'react-toastify/dist/ReactToastify.css';
import Dashborad from './pages/Admin-side/Dashborad'
import Loading from './Loading'



const App = () => {
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(fetchAuthState());
      await dispatch(fetchAdminAuthState());
      setLoading(false);
    };
    checkAuth();
    
  }, [dispatch]);

  if (loading) return <div><Loading/></div>;

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/table" element={<Dashborad />}/>


      </Routes>

      
    </div>
  )
}

export default App
