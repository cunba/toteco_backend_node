import { UUID } from "crypto"
import { pool } from "../../clients/databaseClient"
import { error, info, postgresLog } from "../../constants/constants"
import { Exception } from "../../model/exception"
import { Product } from "../../model/product"
import { IProductsRepository } from "./iProductsRepository"

const schemaName = 'products'

export const productsRepository: IProductsRepository = {
    save: async (product: Product) => {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    updated,
                    in_menu,
                    price,
                    score,
                    publication_id,
                    menu_id
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, product.toArray()
            )
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'New Product data created'))
                return new Exception(200, 'SUCCESS')
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error saving product`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    update: async function (product: Product): Promise<number | Exception> {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    updated,
                    in_menu,
                    price,
                    score,
                    publication_id,
                    menu_id
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, product.toArray()
            )
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Product found by name'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding product by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    delete: async function (id: UUID): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', id, '\t', 'Product deleted'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', id, '\t', 'Error deleting product', err.stack))
                throw new Exception(400, err.message)
            })
    },

    deleteAll: async function (): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Deleted all products'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', 'Error deleting all products', err.stack))
                return new Exception(400, err.message)
            })
    },

    findById: async function (id: UUID): Promise<Product | Exception> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                if (res.rows.length === 0) {
                    throw new Exception(404, 'Not found exception')
                }
                console.log(info(), postgresLog('Postgre', `Product found by id ${id}`))
                const product = new Product()
                product.fromPostgre(res.rows[0])
                return product
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding product by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findByMenu: async function (menuId: string): Promise<Exception | Product[]> {
        const products: Product[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE menu_id = $1`, [menuId])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found by menu ID'))
                res.rows.map((row: any) => {
                    const product = new Product()
                    product.fromPostgre(row)
                    products.push(product)
                })
                return products
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications by menu ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findByPublication: async function (publicationId: string): Promise<Exception | Product[]> {
        const products: Product[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE publication_id = $1`, [publicationId])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found by publication ID'))
                res.rows.map((row: any) => {
                    const product = new Product()
                    product.fromPostgre(row)
                    products.push(product)
                })
                return products
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding products by publication ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findAll: async function (): Promise<Exception | Product[]> {
        const products: Product[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found all'))
                res.rows.map((row: any) => {
                    const product = new Product()
                    product.fromPostgre(row)
                    products.push(product)
                })
                return products
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding products`, err.stack))
                throw new Exception(400, err.message)
            })
    }
}
