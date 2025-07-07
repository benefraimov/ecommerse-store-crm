import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts } from '../features/products/adminProductSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createProduct, deleteProduct } from '../features/products/adminProductSlice'; // ייבוא הפעולות
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { products, isLoading, isError, message } = useSelector((state) => state.adminProducts);

	const createHandler = async () => {
		if (window.confirm('האם ליצור מוצר חדש?')) {
			try {
				const result = await dispatch(createProduct()).then(unwrapResult);
				toast.success('מוצר חדש נוצר');
				navigate(`/products/${result._id}/edit`);
			} catch (err) {
				toast.error(err.message);
			}
		}
	};

	const deleteHandler = (id) => {
		if (window.confirm('האם למחוק את המוצר?')) {
			dispatch(deleteProduct(id));
		}
	};

	useEffect(() => {
		dispatch(fetchAdminProducts());
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
				ניהול מוצרים
			</Typography>
			<Button variant='contained' onClick={createHandler}>
				צור מוצר
			</Button>
			<Box sx={{ overflowX: 'auto' }}>
				<TableContainer sx={{ maxHeight: 600 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>שם</TableCell>
								<TableCell>מחיר</TableCell>
								<TableCell>מלאי</TableCell>
								<TableCell>פעולות</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{products.map((product) => (
								<TableRow hover key={product._id}>
									<TableCell sx={{ direction: 'rtl', textAlign: 'right' }}>{product._id}</TableCell>
									<TableCell>{product.name}</TableCell>
									<TableCell>₪{product.price.toFixed(2)}</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>
										<Button onClick={() => navigate(`/products/${product._id}/edit`)}>
											<Edit />
										</Button>
										<Button color='error' onClick={() => deleteHandler(product._id)}>
											<Delete />
										</Button>
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

export default ProductListPage;
