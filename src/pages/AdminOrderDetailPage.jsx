import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchOrderById, markAsDelivered, reset } from '../features/orders/adminOrdersSlice';
import { Box, Typography, Paper, Grid, CircularProgress, List, ListItem, ListItemText, Divider, Button } from '@mui/material';

const AdminOrderDetailPage = () => {
	const { id: orderId } = useParams();
	const dispatch = useDispatch();

	const { selectedOrder: order, isLoading, isError, isSuccess, message } = useSelector((state) => state.adminOrders);

	useEffect(() => {
		if (isSuccess) {
			toast.success('סטטוס ההזמנה עודכן!');
			dispatch(reset());
		}
		if (isError) {
			toast.error(message);
			dispatch(reset());
		}
		// טען את פרטי ההזמנה אם הם לא קיימים או אם ה-ID השתנה
		if (!order || order._id !== orderId) {
			dispatch(fetchOrderById(orderId));
		}
	}, [orderId, dispatch, isSuccess, isError, message]);

	const deliverHandler = () => {
		dispatch(markAsDelivered(orderId));
	};

	if (isLoading || !order) return <CircularProgress />;

	return (
		<Box>
			<Typography variant='h5' sx={{ mb: 2 }}>
				הזמנה #{order._id}
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Paper sx={{ p: 2 }}>
						<Typography variant='h6'>פרטי משלוח</Typography>
						<Typography>
							<strong>שם:</strong> {order.user.username}
						</Typography>
						<Typography>
							<strong>אימייל:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
						</Typography>
						<Typography>
							<strong>כתובת:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}
						</Typography>
						{order.isDelivered ? (
							<Typography color='success.main' sx={{ mt: 1 }}>
								נמסר ב: {new Date(order.deliveredAt).toLocaleDateString('he-IL')}
							</Typography>
						) : (
							<Typography color='error.main' sx={{ mt: 1 }}>
								טרם נמסר
							</Typography>
						)}
					</Paper>
					<Paper sx={{ p: 2, mt: 3 }}>
						<Typography variant='h6'>פריטים</Typography>
						<List>
							{order.orderItems.map((item, index) => (
								<ListItem key={index} divider>
									<ListItemText primary={item.name} secondary={`${item.qty} x ₪${item.price.toFixed(2)} = ₪${(item.qty * item.price).toFixed(2)}`} />
								</ListItem>
							))}
						</List>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper sx={{ p: 2 }}>
						<Typography variant='h6'>סיכום</Typography>
						<Divider sx={{ my: 1 }} />
						<Typography>
							<strong>סכום:</strong> ₪{order.totalPrice.toFixed(2)}
						</Typography>
						<Typography>
							<strong>תשלום:</strong> {order.isPaid ? 'שולם' : 'לא שולם'}
						</Typography>

						{order.isPaid && !order.isDelivered && (
							<Button variant='contained' fullWidth sx={{ mt: 2 }} onClick={deliverHandler}>
								סמן כ"נשלח"
							</Button>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AdminOrderDetailPage;
