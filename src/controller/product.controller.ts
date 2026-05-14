import type { IncomingMessage, ServerResponse } from "node:http";
import { readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.types";
import { parseBody } from "../utility/parseBody";


export const productController = async(req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method
    const urlParts = url?.split("/");

    //console.log("Request", req);

    // console.log(urlParts);
    const id = urlParts && urlParts[1] === 'product' ? Number(urlParts[2]) : null;
    console.log("this is the actual id : ", id)

    // get all products
    if (url === "/products" && method === "GET") {

        const products = readProduct();
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Products retrives successfully", data: { products } }));
    }
    else if (method === 'GET' && id !== null) {
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id)
        console.log(product);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Product retrives successfully", data: { product } }));
    }
    else if (method === "POST" && url === '/products') {
        const body = await parseBody(req);
        console.log(body);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Products Created successfully" }));
    }
}