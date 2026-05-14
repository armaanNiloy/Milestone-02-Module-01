import fs from "fs"
import path from "node:path"

const filePath = path.join(process.cwd(), './src/database/db.json')

export const readProduct = () => {
    // console.log(filePath)
    const products = fs.readFileSync(filePath, 'utf-8');
    //console.log(JSON.parse(products));
    return JSON.parse(products);

}

export const insertProduct = (payload : any) =>{
    //console.log(JSON.stringify(payload))
    fs.writeFileSync(filePath, JSON.stringify(payload));
}