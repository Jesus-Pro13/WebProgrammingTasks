import { Router } from 'express';
import { ProductController } from '../controllers/products.controllers.ts';

const productController = new ProductController();
const router = Router();

router.get('/getAll', productController.getAllProducts);
router.get('/getById/:id', productController.getProductById);
router.post('/create', productController.createProduct);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.patch('/change-price/:id', productController.changePrice);

export default router;