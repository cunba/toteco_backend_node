import { UUID } from "crypto"
import { pool } from "../../clients/databaseClient"
import { error, info, postgresLog } from "../../constants/constants"
import { Exception } from "../../model/exception"
import { Publication } from "../../model/publication"
import { IPublicationsRepository } from "./iPublicationsRepository"

const schemaName = 'publications'

export const publicationsRepository: IPublicationsRepository = {
    save: async (publication: Publication) => {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    created,
                    updated,
                    total_price,
                    total_score,
                    photo,
                    comment,
                    establishment_id,
                    user_id
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, publication.toArray()
            )
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'New Publication data created'))
                return new Exception(200, 'SUCCESS')
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error saving publication`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    update: async function (publication: Publication): Promise<number | Exception> {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    created,
                    updated,
                    total_price,
                    total_score,
                    photo,
                    comment,
                    establishment_id,
                    user_id
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, publication.toArray()
            )
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Publication found by name'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publication by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    delete: async function (id: UUID): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', id, '\t', 'Publication deleted'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', id, '\t', 'Error deleting publication', err.stack))
                throw new Exception(400, err.message)
            })
    },

    deleteAll: async function (): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Deleted all publications'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', 'Error deleting all publications', err.stack))
                return new Exception(400, err.message)
            })
    },

    findById: async function (id: UUID): Promise<Publication | Exception> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                if (res.rows.length === 0) {
                    throw new Exception(404, 'Not found exception')
                }
                console.log(info(), postgresLog('Postgre', `Publication found by id ${id}`))
                return res.rows[0] as Publication
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publication by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findByEstablishment: async function (establishmentId: string): Promise<Exception | Publication[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE establishment_id = $1`, [establishmentId])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Publications found by establishment ID'))
                return res.rows as Publication[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications by establishment ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findByUser: async function (userId: string): Promise<Exception | Publication[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE user_id = $1`, [userId])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Publications found by user ID'))
                return res.rows as Publication[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications by user ID`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findAll: async function (): Promise<Exception | Publication[]> {
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Publications found all'))
                return res.rows as Publication[]
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    findTotalScoreByEstablishment: async function (establishmentId: UUID): Promise<Exception | number> {
        return await pool
            .query(`SELECT SUM(total_score) FROM ${schemaName} WHERE establishment_id = $1`, [establishmentId])
            .then((res: any) => {
                console.log(info(), postgresLog('Postgre', 'Publications found all'))
                console.log(res.rows)
                return res.rows[0] as number
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding publications`, err.stack))
                throw new Exception(400, err.message)
            })
    }
}
