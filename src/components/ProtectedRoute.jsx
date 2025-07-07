import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
	const { user } = useSelector((state) => state.auth);

	// אם יש משתמש מחובר והוא מנהל, הצג את התוכן. אחרת, העבר להתחברות.
	return user && user.isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
