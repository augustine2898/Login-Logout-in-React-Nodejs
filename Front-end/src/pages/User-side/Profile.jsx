import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchUserData } from '../../features/authSlice';
import Navbar from '../../components/User-side/Navbar';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select a valid image (jpeg, png, jpg, webp, gif).');
        setImage(null);
        setPreview(null);
        return;
      }
  
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please select an image to upload.');

    const formData = new FormData();
    formData.append('profileImage', image);

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/user/upload-profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUserData());
        setPreview(null);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      
      toast.error(error.message);
    }
  };

  const handleRemoveImage = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.delete(`${backendUrl}/api/user/remove-profile`, {
        data: { userId: userData._id },
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUserData());
        setPreview(null);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center pt-24 bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen px-4">
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/')}>
          <img src={assets.arrow_icon} alt="Back" className="w-6 h-6 rotate-180" />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-white">Your Profile</h1>

        {userData && (
          <div className="bg-slate-900 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
            <div className="flex flex-col items-center">
              {preview || userData?.profileImage ? (
                <img
                  src={preview || userData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mb-4 flex items-center justify-center bg-black text-white text-3xl font-semibold">
                  {userData?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <p className="mb-4 text-lg">Name: {userData.name}</p>
              <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4 text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full"
                >
                  Upload Image
                </button>
              </form>
              {userData?.profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full"
                >
                  Remove Profile Image
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
