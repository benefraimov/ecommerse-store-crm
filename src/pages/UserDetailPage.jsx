// src/pages/UserDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // נשתמש ישירות לשם הפשטות
import { Box, Typography, Paper, Grid, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';

const UserDetailPage = () => {
	const { id: userId } = useParams();
	const { user: adminUser } = useSelector((state) => state.auth);

	const [user, setUser] = useState(null);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const config = { headers: { Authorization: `Bearer ${adminUser.token}` } };

				const { data: userData } = await axios.get(`/api/users/${userId}`, config);
				const { data: ordersData } = await axios.get(`/api/orders/user/${userId}`, config);

				setUser(userData);
				setOrders(ordersData);
			} catch (err) {
				setError('Failed to fetch data');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [userId, adminUser.token]);

	if (loading) return <CircularProgress />;
	if (error) return <Typography color='error'>{error}</Typography>;
	if (!user) return <Typography>User not found.</Typography>;

	const totalSpent = orders.reduce((acc, order) => (order.isPaid ? acc + order.totalPrice : acc), 0);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<Paper sx={{ p: 2 }}>
					<Typography variant='h6'>פרטי משתמש</Typography>
					<Divider sx={{ my: 1 }} />
					<Typography>
						<strong>ID:</strong> {user._id}
					</Typography>
					<Typography>
						<strong>שם:</strong> {user.username}
					</Typography>
					<Typography>
						<strong>אימייל:</strong> {user.email}
					</Typography>
					<Typography>
						<strong>מנהל:</strong> {user.isAdmin ? 'כן' : 'לא'}
					</Typography>
				</Paper>
				<Paper sx={{ p: 2, mt: 2 }}>
					<Typography variant='h6'>סיכום פעילות</Typography>
					<Divider sx={{ my: 1 }} />
					<Typography>
						<strong>סך הכל הזמנות:</strong> {orders.length}
					</Typography>
					<Typography>
						<strong>סכום כולל ששולם:</strong> ₪{totalSpent.toFixed(2)}
					</Typography>
				</Paper>
			</Grid>
			<Grid item xs={12} md={8}>
				<Paper sx={{ p: 2 }}>
					<Typography variant='h6'>היסטוריית הזמנות</Typography>
					<List>
						{orders.map((order) => (
							<ListItem key={order._id} divider>
								<ListItemText
									primary={`הזמנה #${order._id}`}
									secondary={`תאריך: ${new Date(order.createdAt).toLocaleDateString('he-IL')} - סכום: ₪${order.totalPrice.toFixed(2)} - שולם: ${order.isPaid ? 'כן' : 'לא'}`}
								/>
							</ListItem>
						))}
					</List>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default UserDetailPage;
