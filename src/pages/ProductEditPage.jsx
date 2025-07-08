// src/pages/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, TextField, CircularProgress, Paper, Typography, Box, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { fetchAdminProducts, updateProduct, resetAdminProductStatus } from '../features/products/adminProductSlice';
import { getImageUrl } from '../utils/imageUtils';

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

	// State for choosing image input method
	const [imageInputMethod, setImageInputMethod] = useState('url');

	const { products, isLoading, isError, isSuccess, message } = useSelector((state) => state.adminProducts);

	useEffect(() => {
		if (isSuccess) {
			toast.success('המוצר עודכן בהצלחה!');
			navigate('/products');
		}
		if (isError) {
			toast.error(message);
		}
	}, [isSuccess, isError, message, navigate, dispatch]);

	useEffect(() => {
		// התיקון כאן: מאפסים את הסטטוס מיד עם טעינת העמוד
		dispatch(resetAdminProductStatus());

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
		if (!file) return;
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data.image);
			setUploading(false);
			toast.success('התמונה הועלתה בהצלחה');
		} catch (error) {
			toast.error('העלאת התמונה נכשלה');
			setUploading(false);
		}
	};

	const handleInputMethodChange = (e) => {
		setImageInputMethod(e.target.value);
		setImage(''); // איפוס התמונה при שינוי שיטה
	};

	if (isLoading && !products.length) return <CircularProgress />;

	return (
		<Paper sx={{ p: 3 }}>
			<Button component={Link} to='/products' sx={{ mb: 2 }}>
				חזרה לרשימת המוצרים
			</Button>
			<Typography variant='h5' sx={{ mb: 2 }}>
				עריכת מוצר
			</Typography>
			<Box component='form' onSubmit={submitHandler}>
				<Grid container spacing={3}>
					{/* Column for details */}
					<Grid item xs={12} md={8}>
						<TextField fullWidth label='שם המוצר' value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} required />
						<TextField fullWidth label='מחיר' type='number' value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} required />
						<TextField fullWidth label='מלאי' type='number' value={stock} onChange={(e) => setStock(e.target.value)} sx={{ mb: 2 }} required />
						<TextField fullWidth label='תיאור' multiline rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
					</Grid>
					{/* Column for image */}
					<Grid item xs={12} md={4}>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>אפשרות תמונה</FormLabel>
							<RadioGroup row value={imageInputMethod} onChange={handleInputMethodChange}>
								<FormControlLabel value='url' control={<Radio />} label='כתובת URL' />
								<FormControlLabel value='upload' control={<Radio />} label='העלאת קובץ' />
							</RadioGroup>
						</FormControl>

						{imageInputMethod === 'url' && <TextField fullWidth label='נתיב תמונה' value={image} onChange={(e) => setImage(e.target.value)} sx={{ mt: 1 }} />}

						{imageInputMethod === 'upload' && (
							<Box sx={{ mt: 2 }}>
								<Button variant='outlined' component='label' fullWidth>
									בחר קובץ
									<input type='file' hidden onChange={uploadFileHandler} />
								</Button>
								{uploading && <CircularProgress size={24} sx={{ mt: 1 }} />}
							</Box>
						)}

						{image && (
							<Box sx={{ mt: 2, border: '1px solid #ddd', p: 1, borderRadius: 1 }}>
								<Typography variant='caption'>תצוגה מקדימה:</Typography>
								<img src={getImageUrl(image)} alt='תצוגה מקדימה' style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }} />
							</Box>
						)}
					</Grid>
					<Grid item xs={12}>
						<Button type='submit' variant='contained' disabled={isLoading} sx={{ mt: 2 }}>
							{isLoading ? 'מעדכן...' : 'עדכן מוצר'}
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
};
export default ProductEditPage;
