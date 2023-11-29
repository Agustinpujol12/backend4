import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class ProductManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    };

    addProduct = async (product) => {
        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        product.status = product.status ?? true;

        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products;
    };

    async getProductById(id) {


        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            return "No encontrado";
        }
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updatedProduct;
        } else {
            return undefined;
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter((p) => p.id !== id);

        if (products.length !== updatedProducts.length) {
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
            return "success";
        } else {
            return "No encontrado";
        }
    }
}

export {ProductManagerFile};