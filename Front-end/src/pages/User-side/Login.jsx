// pages/User-side/Login.jsx
import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../features/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const validateForm = () => {
    let isValid = true;
  
    if (state === 'Sign Up') {
      const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@#$%^&+=_.-]*$/;
      if (!name) {
        toast.error('Name is required');
        isValid = false;
      } else if (!usernameRegex.test(name)) {
        toast.error('Name must contain at least one letter and can include numbers or special characters');
        isValid = false;
      }
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      toast.error('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      toast.error('Enter a valid email');
      isValid = false;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/;
    if (!password) {
      toast.error('Password is required');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character');
      isValid = false;
    }
  
    return isValid;
  };
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
        if (data.success) {
          dispatch(fetchUserData());
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
        if (data.success) {
          dispatch(fetchUserData());
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt=""
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h1 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h1>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none'
                type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none'
              type="email"
              placeholder='Email id' required />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none'
              type="password"
              placeholder='Password' required />
          </div>
          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot password</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login</span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login;
