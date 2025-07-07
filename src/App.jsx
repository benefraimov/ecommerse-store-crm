import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import ProductListPage from './pages/ProductListPage';
import UserDetailPage from './pages/UserDetailPage';
import OrderListPage from './pages/OrderListPage.jsx';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductEditPage from './pages/ProductEditPage.jsx';

function App() {
	return (
		<>
			<ToastContainer position='top-center' autoClose={3000} />
			<Routes>
				<Route path='/login' element={<LoginPage />} />

				{/* כל הנתיבים כאן מוגנים ונגישים רק למנהל מחובר */}
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path='/' element={<DashboardPage />} />
						<Route path='/users' element={<UserListPage />} />
						<Route path='/products' element={<ProductListPage />} />
						<Route path='/users/:id' element={<UserDetailPage />} />
						<Route path='/orders' element={<OrderListPage />} />
						<Route path='/orders/:id' element={<AdminOrderDetailPage />} />
						<Route path='/products/:id/edit' element={<ProductEditPage />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
