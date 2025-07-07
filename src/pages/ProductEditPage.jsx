// src/pages/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, TextField, CircularProgress, Paper, Typography, Box, Grid } from '@mui/material';
import { fetchAdminProducts, updateProduct, resetAdminProductStatus } from '../features/products/adminProductSlice';

const ProductEditPage = () => {
	const { id: productId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState('');
	const [stock, setStock] = useState(0);
	const [description, setDescription] = useState('');
	const [uploading, setUploading] = useState(false);

	const { products, isLoading, isError, isSuccess, message } = useSelector((state) => state.adminProducts);

	useEffect(() => {
		if (isSuccess) {
			toast.success('המוצר עודכן בהצלחה!');
			navigate('/products');
		}
		if (isError) {
			toast.error(message);
		}
		return () => {
			dispatch(resetAdminProductStatus());
		};
	}, [isSuccess, isError, message, navigate, dispatch]);

	useEffect(() => {
		const product = products.find((p) => p._id === productId);
		if (product) {
			setName(product.name);
			setPrice(product.price);
			setImage(product.image);
			setStock(product.stock);
			setDescription(product.description);
		} else {
			// אם המוצרים עדיין לא נטענו, נטען אותם
			dispatch(fetchAdminProducts());
		}
	}, [productId, products, dispatch]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(updateProduct({ _id: productId, name, price, image, stock, description }));
	};

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data.image);
			setUploading(false);
		} catch (error) {
			toast.error('העלאת התמונה נכשלה');
			setUploading(false);
		}
	};

	return (
		<Paper sx={{ p: 3 }}>
			<Link to='/products'>חזרה לרשימת המוצרים</Link>
			<Typography variant='h5' sx={{ my: 2 }}>
				עריכת מוצר
			</Typography>
			{isLoading ? (
				<CircularProgress />
			) : (
				<Box component='form' onSubmit={submitHandler}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField fullWidth label='שם המוצר' value={name} onChange={(e) => setName(e.target.value)} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth label='מחיר' type='number' value={price} onChange={(e) => setPrice(e.target.value)} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth label='מלאי' type='number' value={stock} onChange={(e) => setStock(e.target.value)} />
						</Grid>
						<Grid item xs={12}>
							<TextField fullWidth label='נתיב תמונה' value={image} onChange={(e) => setImage(e.target.value)} />
						</Grid>
						<Grid item xs={12}>
							<Button variant='contained' component='label'>
								העלה תמונה <input type='file' hidden onChange={uploadFileHandler} />
							</Button>
							{uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
						</Grid>
						<Grid item xs={12}>
							<TextField fullWidth label='תיאור' multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
						</Grid>
						<Grid item xs={12}>
							<Button type='submit' variant='contained' disabled={isLoading}>
								עדכן מוצר
							</Button>
						</Grid>
					</Grid>
				</Box>
			)}
		</Paper>
	);
};
export default ProductEditPage;
