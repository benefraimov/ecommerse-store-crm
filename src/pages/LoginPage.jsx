import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice'; // נשתמש ב-login כדי לעדכן את ה-state בסוף
import { toast } from 'react-toastify';
import axios from 'axios';
import { Avatar, Button, TextField, Box, Typography, Container, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
	const [stage, setStage] = useState('credentials'); // 'credentials' or '2fa'
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [twoFactorCode, setTwoFactorCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user, isSuccess } = useSelector((state) => state.auth);

	useEffect(() => {
		if (isSuccess || user) {
			navigate('/');
		}
		return () => {
			dispatch(reset());
		};
	}, [user, isSuccess, navigate, dispatch]);

	const handleCredentialsSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await axios.post('/api/users/admin/login', { email, password });
			toast.success('קוד אימות נשלח למייל שלך');
			setStage('2fa');
		} catch (error) {
			toast.error(error.response?.data?.message || 'שגיאה בשליחת הקוד');
		} finally {
			setIsLoading(false);
		}
	};

	const handle2faSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { data } = await axios.post('/api/users/admin/verify', { email, twoFactorCode });
			// לאחר אימות מוצלח, נפעיל את הלוגיקה של Redux
			dispatch(login(data));
		} catch (error) {
			toast.error(error.response?.data?.message || 'קוד אימות שגוי');
		} finally {
			setIsLoading(false);
		}
	};

	if (stage === '2fa') {
		return (
			<Container component='main' maxWidth='xs'>
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography component='h1' variant='h5'>
						אימות דו-שלבי
					</Typography>
					<Typography sx={{ mt: 1 }}>הזן את הקוד בן 6 הספרות שנשלח למייל</Typography>
					<Box component='form' onSubmit={handle2faSubmit} sx={{ mt: 1 }}>
						<TextField margin='normal' required fullWidth label='קוד אימות' value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} />
						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
							{isLoading ? <CircularProgress size={24} /> : 'אמת והתחבר'}
						</Button>
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<Container component='main' maxWidth='xs'>
			<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					כניסת מנהלים
				</Typography>
				<Box component='form' onSubmit={handleCredentialsSubmit} sx={{ mt: 1 }}>
					<TextField margin='normal' required fullWidth label='כתובת אימייל' value={email} onChange={(e) => setEmail(e.target.value)} />
					<TextField margin='normal' required fullWidth name='password' label='סיסמה' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
					<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
						{isLoading ? <CircularProgress size={24} /> : 'המשך לאימות'}
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

export default LoginPage;
