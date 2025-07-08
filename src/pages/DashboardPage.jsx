import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';
import { Grid, Card, Typography, Box, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatCard = ({ title, value, icon, color, linkTo }) => (
	<Link to={linkTo} style={{ textDecoration: 'none' }}>
		<Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
			<Box sx={{ p: 2, bgcolor: color, color: 'white', borderRadius: '50%', display: 'flex' }}>{icon}</Box>
			<Box sx={{ ml: 2, mr: 2 }}>
				<Typography color='text.secondary'>{title}</Typography>
				<Typography variant='h5' component='p'>
					{value}
				</Typography>
			</Box>
		</Card>
	</Link>
);

const DashboardPage = () => {
	const dispatch = useDispatch();
	const { stats, isLoading } = useSelector((state) => state.dashboard);

	useEffect(() => {
		dispatch(fetchDashboardStats());
	}, [dispatch]);

	if (isLoading) return <CircularProgress />;

	return (
		<Box>
			<Typography variant='h4' gutterBottom>
				דשבורד ראשי
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard title='סך הכל הכנסות' value={`₪${stats.totalSales.toFixed(2)}`} icon={<AttachMoneyIcon />} color='success.main' linkTo='/orders' />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard title="סה''כ הזמנות" value={stats.totalOrders} icon={<ShoppingBasketIcon />} color='info.main' linkTo='/orders' />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard title="סה''כ מוצרים" value={stats.totalProducts} icon={<StorefrontIcon />} color='warning.main' linkTo='/products' />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard title="סה''כ משתמשים" value={stats.totalUsers} icon={<PeopleIcon />} color='secondary.main' linkTo='/users' />
				</Grid>
				{/* כאן ניתן להוסיף בעתיד גרפים מ-Recharts */}
			</Grid>
		</Box>
	);
};

export default DashboardPage;
