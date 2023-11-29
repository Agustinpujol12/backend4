import { Router } from "express";
import { CartManagerFile } from "../managers/CartManagerFile.js";

const path = "carts.json";
const router = Router();
const cartManagerFile = new CartManagerFile(path);

router.get('/', async (req, res) => {
    try {
        const carts = await cartManagerFile.getCarts();

        res.send({
            status: "success",
            carts: carts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const carts = await cartManagerFile.getCartById(cid);

        if (carts !== "Not found") {
            res.send({
                status: "success",
                product: carts
            });
        } else {
            res.status(404).send({
                status: "error",
                msg: "Carrito no encontrado"
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
        const { products } = req.body;

        await cartManagerFile.addCart(products);

        res.status(201).send({
            status: 'success',
            msg: 'Carrito creado',
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Error interno',
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const productToCart = await cartManagerFile.addProductToCart(cid, pid, quantity);

        const carts = await cartManagerFile.getCartById(cid);

        if (productToCart) {
            res.status(201).send({
                status: "success",
                msg: 'Producto añadido',
                carts
            });
        } else {
            res.status(401).send({
                status: "error",
                msg: 'Error al añadir el producto'
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

export { router as cartRouter };