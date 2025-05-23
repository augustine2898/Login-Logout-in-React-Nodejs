import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminAuthState } from '../features/adminSlice';

const useAdminProtect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, admin, loading } = useSelector((state) => state.admin);

  // Fetch auth state on first render
  useEffect(() => {
    dispatch(fetchAdminAuthState());
  }, [dispatch]);

  // Redirect if user is logged out and trying to access protected routes
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');  // Redirect to login if not authenticated
    }
  }, [loading, isAuthenticated, navigate]);

  // Optionally, redirect if the admin's role is not "admin"
  useEffect(() => {
    if (!loading && isAuthenticated && admin?.role !== 'admin') {
      navigate('/admin/login');  // Redirect to login if the role is not admin
    }
  }, [loading, isAuthenticated, admin, navigate]);
};

export default useAdminProtect;
