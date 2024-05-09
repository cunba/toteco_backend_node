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
            .query(`DELETE FROM ${schemaName} WHERE id = ${id}`)
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
            .query(`SELECT * FROM ${schemaName} WHERE name = ${id}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', `Product found by id ${id}`))
                return res.rows[0] as Product
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding product by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findByMenu: async function (menuId: string): Promise<Exception | Product[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE menu_id = ${menuId}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found by menu ID'))
                return res.rows as Product[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications by menu ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findByPublication: async function (publicationId: string): Promise<Exception | Product[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE publication_id = ${publicationId}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found by publication ID'))
                return res.rows as Product[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding products by publication ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findAll: async function (): Promise<Exception | Product[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Products found all'))
                return res.rows as Product[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding products`, err.stack))
                throw new Exception(400, err.message)
            })
    }
}
