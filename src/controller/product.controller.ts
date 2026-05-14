import type { IncomingMessage, ServerResponse } from "node:http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.types";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";


export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method
    const urlParts = url?.split("/");

    //console.log("Request", req);

    //console.log(urlParts);
    const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null;
    console.log("this is the actual id : ", id)

    // get all products
    if (url === "/products" && method === "GET") {

        const products = readProduct();
        try {
            return sendResponse(res, 200, true, "Products retrive Successfully", products)
        } catch (error) {
            return sendResponse(res, 500, false, "There is a problem", error)
        }
    } // single product
    else if (method === 'GET' && id !== null) {
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id)
        console.log(product);
        if (!product) {
            return sendResponse(res, 404, false, "product not found")
        }
        else {
            return sendResponse(res, 200, true, "Product retrive Successfully", product)
        }
    } // add product
    else if (method === "POST" && url === '/products') {
        // created product by post method
        const body = await parseBody(req);
        const products = readProduct();
        const newProduct = {
            id: Date.now(),
            ...body,
        }
        products.push(newProduct);
        console.log(newProduct);
        insertProduct(products);
        return sendResponse(res, 200, true, "Product Added Successfully", newProduct)
    }
    else if (method === "PUT" && id !== null) {
        const body = await parseBody(req);
        const products = readProduct();
        const index = products.findIndex((p: IProduct) => p.id === id);
        console.log(index);
        if (index < 0) {
            return sendResponse(res, 404, false, "product not found")
        }
        else {
            products[index] = { id: products[index].id, ...body }
            insertProduct(products);
            return sendResponse(res, 200, true, "Product Edited Successfully", products)
        }

    }
    else if (method === 'DELETE' && id !== null) {

        const products = readProduct();
        console.log(id);
        const index = products.findIndex((p: IProduct) => p.id === id);
        console.log("this is index", index);
        console.log(products[index]);
        products.splice(index, 1);
        // console.log(products);

        if (index < 0) {
            return sendResponse(res, 404, false, "product not found")
        }
        else {

            insertProduct(products);
            return sendResponse(res, 200, true, "Product Deleted Successfully", products)
        }
    }
}

