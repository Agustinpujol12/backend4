import { Router } from "express";
import { ProductManagerFile } from "../managers/ProductManagerFile.js";

const path = "products.json";
const router = Router();
const productsManagerFile = new ProductManagerFile(path);

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = limit ? await productsManagerFile.getProducts().then(data => data.slice(0, parseInt(limit))) : await productsManagerFile.getProducts();

        res.send({
            status: "success",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productsManagerFile.getProductById(productId);

        if (product !== "Not found") {
            res.send({
                status: "success",
                product: product
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: "Producto no encontrado"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            typeof category !== 'string' ||
            typeof price !== 'number' ||
            typeof stock !== 'number'
        ) {
            return res.status(400).send({
                status: 'error',
                msg: 'Tipos de datos no validos para uno o mas campos',
            });
        }

        if (thumbnails && (!Array.isArray(thumbnails) || !thumbnails.every(thumbnail => typeof thumbnail === 'string'))) {
            return res.status(400).send({
                status: 'error',
                msg: 'Tipo de dato no valido para thumbnails',
            });
        }

        const product = { title, description, code, price, stock, category, thumbnails };

        productsManagerFile.addProduct(product)
            .then((products) => {
                res.status(201).send({
                    status: 'success',
                    msg: 'Producto creado',
                    products,
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    status: 'error',
                    msg: 'Error interno',
                });
            });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateProduct = await productsManagerFile.updateProduct(pid, req.body);

        if (updateProduct)
            res.send({
                status: "success",
                product: updateProduct
            });
        else
            res.status(404).send("Product not found");
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const deleteProduct = await productsManagerFile.deleteProduct(pid);

        if (deleteProduct === "success")
            res.send({
                status: "success",
                msg: `Producto eliminado con el id: ${pid}`
            });
        else
            res.status(404).send("Product not found");
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

export { router as productRouter };