import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchAdminAuthState } from '../../features/adminSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password }, { withCredentials: true });

      if (data.success) {
        await dispatch(fetchAdminAuthState());
        toast.success("Login successful");
        console.log("navigating...");
        navigate('/admin/table');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-300 to-purple-400 relative">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute top-5 left-6 sm:left-20 w-28 sm:w-32 cursor-pointer"
      />

      <form onSubmit={onSubmitHandler} className="bg-white p-8 shadow-lg rounded-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-3 text-gray-800">Admin Login</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Access the admin dashboard</p>

        <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 mb-4">
          <img src={assets.mail_icon} alt="Email Icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-100 mb-4">
          <img src={assets.lock_icon} alt="Password Icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-transparent outline-none w-full"
          />
        </div>

        <p onClick={() => navigate('/admin/forgot-password')} className="mb-4 text-indigo-600 text-sm cursor-pointer text-right">
          Forgot password?
        </p>

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
