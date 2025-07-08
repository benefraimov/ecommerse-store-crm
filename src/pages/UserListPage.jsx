import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, toggleAdminStatus } from '../features/users/userListSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box, Switch } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserListPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { users, isLoading, isError, message } = useSelector((state) => state.userList);
	const { user: loggedInUser } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getUsers());
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

	const handleToggleAdmin = (e, userId) => {
		e.stopPropagation();

		dispatch(toggleAdminStatus(userId))
			.unwrap()
			.then(() => toast.success('הרשאות המשתמש עודכנו'))
			.catch((err) => toast.error(err));
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<Typography variant='h5' component='h2' sx={{ p: 2 }}>
				רשימת משתמשים
			</Typography>
			<Box sx={{ overflowX: 'auto' }}>
				<TableContainer sx={{ maxHeight: 600 }}>
					<Table stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>שם</TableCell>
								<TableCell>אימייל</TableCell>
								<TableCell>מנהל</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow hover role='checkbox' tabIndex={-1} key={user._id} onClick={() => navigate(`/users/${user._id}`)} sx={{ cursor: 'pointer' }}>
									<TableCell>{user._id}</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.isAdmin ? <CheckCircle color='success' /> : <Cancel color='error' />}</TableCell>
									<TableCell align='center' onClick={(e) => e.stopPropagation()}>
										<Switch
											checked={user.isAdmin}
											onChange={(e) => handleToggleAdmin(e, user._id)}
											// מאפשר עריכה רק אם אתה הסופר אדמין, ולא עורך את עצמך
											disabled={
												loggedInUser.email !== (import.meta.env.VITE_ENVIRONMENT === 'production' ? import.meta.env.VITE_SUPER_ADMIN_EMAI : import.meta.env.VITE_SUPER_ADMIN_EMAIL_DEV) ||
												loggedInUser._id === user._id
											}
										/>
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

export default UserListPage;
