import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/users/userListSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { users, isLoading, isError, message } = useSelector((state) => state.userList);

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
