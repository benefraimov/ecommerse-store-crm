import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const drawerWidth = 240;

const Layout = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	// 1. הוספת הוקים נחוצים
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	// 2. הוספת פונקציה להתנתקות
	const logoutHandler = () => {
		dispatch(logout());
		navigate('/login');
	};

	const menuItems = [
		{ text: 'דשבורד', icon: <DashboardIcon />, path: '/' },
		{ text: 'ניהול משתמשים', icon: <PeopleIcon />, path: '/users' },
		{ text: 'ניהול מוצרים', icon: <StorefrontIcon />, path: '/products' },
		{ text: 'ניהול הזמנות', icon: <ShoppingBasketIcon />, path: '/orders' },
	];

	const drawerContent = (
		<div>
			<Toolbar />
			<List>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton component={NavLink} to={item.path} onClick={() => setMobileOpen(false)}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<Box sx={{ display: 'flex', direction: 'rtl' }}>
			<AppBar
				position='fixed'
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					mr: { md: `${drawerWidth}px` },
				}}>
				<Toolbar>
					<IconButton color='inherit' aria-label='open drawer' edge='start' onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }} style={{margin: "15px"}}>
						מערכת ניהול E-Shop
					</Typography>

					{/* 3. הוספת שם המשתמש וכפתור ההתנתקות */}
					{user && (
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography sx={{ ml: 2 }}>{user.username}</Typography>
							<Tooltip title='התנתק'>
								<IconButton color='inherit' onClick={logoutHandler}>
									<LogoutIcon />
								</IconButton>
							</Tooltip>
						</Box>
					)}
				</Toolbar>
			</AppBar>
			<Box component='nav' sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
				{/* ... Drawer למובייל ... */}
				<Drawer
					variant='temporary'
					anchor='right'
					open={isMobile && mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
					{drawerContent}
				</Drawer>
				{/* ... Drawer למחשב ... */}
				<Drawer variant='permanent' anchor='right' sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
					{drawerContent}
				</Drawer>
			</Box>
			<Box component='main' sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
