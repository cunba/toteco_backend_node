import { UUID } from "crypto"
import { pool } from "../../clients/databaseClient"
import { error, infoLog, postgresLog } from "../../constants/constants"
import { Exception } from "../../model/exception"
import { Menu } from "../../model/menu"
import { IMenusRepository } from "./iMenusRepository"

const schemaName = 'menus'

export const menusRepository: IMenusRepository = {
    save: async (menu: Menu) => {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    location,
                    is_open,
                    score
                ) VALUES($1, $2, $3, $4, $5, $6)`, menu.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'New Menu data created'))
                return new Exception(200, 'SUCCESS')
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error saving menu`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    update: async function (menu: Menu): Promise<number | Exception> {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    location,
                    is_open,
                    score
                ) VALUES($1, $2, $3, $4, $5, $6)`, menu.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Menu found by name'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding menu by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    delete: async function (id: UUID): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', id, '\t', 'Menu deleted'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', id, '\t', 'Error deleting menu', err.stack))
                throw new Exception(400, err.message)
            })
    },

    deleteAll: async function (): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Deleted all menus'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', 'Error deleting all menus', err.stack))
                return new Exception(400, err.message)
            })
    },

    findById: async function (id: UUID): Promise<Menu | Exception> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                if (res.rows.length === 0) {
                    throw new Exception(404, 'Not found exception')
                }
                console.log(infoLog(), postgresLog('Postgre', `Menu found by id ${id}`))
                return res.rows[0] as Menu
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding menu by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findAll: async function (): Promise<Exception | Menu[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Menus found all'))
                return res.rows as Menu[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding menus`, err.stack))
                throw new Exception(400, err.message)
            })
    }
}
