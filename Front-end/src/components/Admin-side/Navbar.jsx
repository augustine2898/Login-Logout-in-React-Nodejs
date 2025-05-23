import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { adminLogout } from "../../features/adminSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin.admin); 
  const isAdminLoggedIn = useSelector((state) => state.admin.isAuthenticated);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const logoutHandler = async () => {
    try {
      
      await axios.post(`${backendUrl}/api/admin/logout`, {}, { withCredentials: true });
      
      const result = await dispatch(adminLogout())
      if (result.success) {
        navigate("/admin/login"); 
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while logging out.");
    }
  };

  useEffect(() => {
      if  (!isAdminLoggedIn) {
        navigate('/admin/login');  
      }
    }, [isAdminLoggedIn, navigate]);

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-[#0f172a] shadow-md sticky top-0 z-50">
      <h1 className="text-white text-xl font-semibold"></h1>

      {adminData && (
        <div className="relative group">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-800 flex justify-center items-center text-white cursor-pointer">
            {adminData.profileImage ? (
              <img
                src={adminData.profileImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold">
                {adminData.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="absolute hidden group-hover:block top-12 right-0 bg-white text-black rounded shadow-lg z-50">
            <ul className="text-sm py-2 min-w-[140px]">
              <li
                onClick={() => navigate("/admin/profile")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={logoutHandler}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
