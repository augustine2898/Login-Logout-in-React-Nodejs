// components/User-side/Navbar.jsx
import React from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const result = await dispatch(logoutUser()).unwrap();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />

      {userData ? (
        <div className='relative group'>
          <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex justify-center items-center bg-black text-white'>
                {userData.name[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          <div className='absolute hidden group-hover:block top-10 right-0 z-10 text-black rounded shadow-lg'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm min-w-[120px] rounded'>
              <li
                onClick={() => navigate('/profile')}
                className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
              >
                Profile
              </li>
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logoutHandler}
                className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
