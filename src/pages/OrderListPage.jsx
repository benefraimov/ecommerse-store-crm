import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../features/orders/adminOrdersSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box, Chip } from '@mui/material';
import { Check, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
    const navigate = useNavigate()
	const dispatch = useDispatch();
	const { orders, isLoading, isError, message } = useSelector((state) => state.adminOrders);

	useEffect(() => {
		dispatch(fetchAllOrders());
	}, [dispatch]);

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return <Typography color='error'>שגיאה: {message}</Typography>;
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<Typography variant='h5' component='h2' sx={{ p: 2 }}>
				ניהול הזמנות
			</Typography>
			<Box sx={{ overflowX: 'auto' }}>
				<TableContainer sx={{ minWidth: 800 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>ID הזמנה</TableCell>
								<TableCell>משתמש</TableCell>
								<TableCell>תאריך</TableCell>
								<TableCell>סכום</TableCell>
								<TableCell>שולם</TableCell>
								<TableCell>נשלח</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<TableRow hover key={order._id} onClick={() => navigate(`/orders/${order._id}`)} sx={{ cursor: 'pointer' }}>
									<TableCell>{order._id}</TableCell>
									<TableCell>{order.user?.username || 'משתמש לא ידוע'}</TableCell>
									<TableCell>{new Date(order.createdAt).toLocaleDateString('he-IL')}</TableCell>
									<TableCell>₪{order.totalPrice.toFixed(2)}</TableCell>
									<TableCell>{order.isPaid ? <Chip icon={<Check />} label='שולם' color='success' size='small' /> : <Chip icon={<Cancel />} label='לא שולם' color='error' size='small' />}</TableCell>
									<TableCell>
										{order.isDelivered ? <Chip icon={<Check />} label='נשלח' color='success' size='small' /> : <Chip icon={<Cancel />} label='לא נשלח' color='default' size='small' />}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Paper>
	);
};

export default OrderListPage;
