import { UUID } from "crypto"
import { pool } from "../../clients/databaseClient"
import { error, infoLog, postgresLog } from "../../constants/constants"
import { Establishment } from "../../model/establishment"
import { Exception } from "../../model/exception"
import { IEstablishmentsRepository } from "./iEstablishmentsRepository"

const schemaName = 'establishments'

export const establishmentsRepository: IEstablishmentsRepository = {
    save: async (establishment: Establishment) => {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    updated,
                    location,
                    is_open,
                    is_computer_allowed,
                    maps_id,
                    score
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, establishment.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'New Establishment data created'))
                return new Exception(200, 'SUCCESS')
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error saving establishment`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    findByName: async function (name: string): Promise<Exception | Establishment[]> {
        const establishments: Establishment[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE name = $1`, [name])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Establishment found by name'))
                res.rows.map((row: any) => {
                    const establishment = new Establishment()
                    establishment.fromPostgre(row)
                    establishments.push(establishment)
                })
                return establishments
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishment by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findByMapsId: async function (mapsId: string): Promise<Exception | Establishment[]> {
        const establishments: Establishment[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE maps_id = $1`, [mapsId])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Establishment found by maps ID'))
                res.rows.map((row: any) => {
                    const establishment = new Establishment()
                    establishment.fromPostgre(row)
                    establishments.push(establishment)
                })
                return establishments
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishment by maps ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    update: async function (establishment: Establishment): Promise<number | Exception> {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    name,
                    created,
                    updated,
                    location,
                    is_open,
                    is_computer_allowed,
                    maps_id,
                    score
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, establishment.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Establishment found by name'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishment by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    delete: async function (id: UUID): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', id, '\t', 'Establishment deleted'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', id, '\t', 'Error deleting establishment', err.stack))
                throw new Exception(400, err.message)
            })
    },

    deleteAll: async function (): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Deleted all establishments'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', 'Error deleting all establishments', err.stack))
                return new Exception(400, err.message)
            })
    },

    findById: async function (id: UUID): Promise<Establishment | Exception> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                if (res.rows.length === 0) {
                    throw new Exception(404, 'Not found exception')
                }
                console.log(infoLog(), postgresLog('Postgre', `Establishment found by id ${id}`))
                const establishment = new Establishment()
                establishment.fromPostgre(res.rows[0])
                return establishment
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishment by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findAll: async function (): Promise<Exception | Establishment[]> {
        const establishments: Establishment[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Establishments found all'))
                res.rows.map((row: any) => {
                    const establishment = new Establishment()
                    establishment.fromPostgre(row)
                    establishments.push(establishment)
                })
                return establishments
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishments`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    updateScore: async function (id: UUID, score: number): Promise<Exception | boolean> {
        return await pool
            .query(`UPDATE ${schemaName} SET score = $2 WHERE id = $1`, [id, score])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Establishments found all'))
                return true
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding establishments`, err.stack))
                throw new Exception(400, err.message)
            })
    },
}
