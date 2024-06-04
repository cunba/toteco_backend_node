import { UUID } from "crypto"
import { pool } from "../../clients/databaseClient"
import { error, infoLog, postgresLog } from "../../constants/constants"
import { Exception } from "../../model/exception"
import { User } from "../../model/user"
import { IUsersRepository } from "./iUsersRepository"

const schemaName = 'users'

export const usersRepository: IUsersRepository = {
    save: async (user: User) => {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    username,
                    name,
                    surname,
                    birth_date,
                    email,
                    password,
                    created,
                    updated,
                    photo,
                    is_active,
                    money_spent,
                    publications_number,
                    role,
                    recovery_code
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`, user.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'New User data created'))
                return new Exception(200, 'SUCCESS')
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error saving user`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    update: async function (user: User): Promise<number | Exception> {
        return await pool
            .query(
                `INSERT INTO ${schemaName}(
                    id,
                    username,
                    name,
                    surname,
                    birth_date,
                    email,
                    password,
                    created,
                    updated,
                    is_active,
                    money_spent,
                    publications_number,
                    role,
                    recovery_code
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, user.toArray()
            )
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User found by name'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding user by name`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    delete: async function (id: UUID): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', id, '\t', 'User deleted'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', id, '\t', 'Error deleting user', err.stack))
                throw new Exception(400, err.message)
            })
    },

    deleteAll: async function (): Promise<number | Exception> {
        return await pool
            .query(`DELETE FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Deleted all users'))
                return res.rowCount
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', 'Error deleting all users', err.stack))
                return new Exception(400, err.message)
            })
    },

    findById: async function (id: UUID): Promise<User | Exception> {
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE id = $1`, [id])
            .then((res: any) => {
                if (res.rows.length === 0) {
                    throw new Exception(404, 'Not found exception')
                }
                console.log(infoLog(), postgresLog('Postgre', `User found by id ${id}`))
                const user = new User()
                user.fromPostgre(res.rows[0])
                return user
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding user by id ${id}`, err.stack))
                if (err.code === '42601')
                    throw new Exception(404, 'Not found exception')
                throw new Exception(400, err.message)
            })
    },

    findByUsername: async function (username: string): Promise<Exception | User[]> {
        const users: User[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE username = $1`, [username])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User found by username'))
                res.rows.map((row: any) => {
                    const user = new User()
                    user.fromPostgre(row)
                    users.push(user)
                })
                return users
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding user by username`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findByEmail: async function (email: string): Promise<Exception | User[]> {
        const users: User[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName} WHERE email = $1`, [email])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User found by email'))
                res.rows.map((row: any) => {
                    const user = new User()
                    user.fromPostgre(row)
                    users.push(user)
                })
                return users
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding user by username`, err.stack))
                throw new Exception(400, "Function not implemented.")
            })
    },

    findAll: async function (): Promise<Exception | User[]> {
        const users: User[] = []
        return await pool
            .query(`SELECT * FROM ${schemaName}`)
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'Users found all'))
                res.rows.map((row: any) => {
                    const user = new User()
                    user.fromPostgre(row)
                    users.push(user)
                })
                return users
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error finding users`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    activate: async function (id: UUID): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET is_active = $1 WHERE id = $2`, [true, id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User activated'))
                return 'User activated'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error activating user`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    disable: async function (id: UUID): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET is_active = $1 WHERE id = $2`, [false, id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User disabled'))
                return 'User disabled'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error disabling user`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    updateMoneySpent: async function (id: UUID): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET money_spent = (SELECT SUM(total_price) FROM publications WHERE user_id = $1) WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User money spent updated'))
                return 'User money spent updated'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error updating money spent`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    updatePassword: async function (id: UUID, password: string): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET password = $2 WHERE id = $1`, [id, password])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User password updated'))
                return 'User password updated'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error updating password`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    updateRecoveryCode: async function (id: UUID, code: number | undefined): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET recovery_code = $2 WHERE id = $1`, [id, code])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User recovery code updated'))
                return 'User recovery code updated'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error updating recovery code`, err.stack))
                throw new Exception(400, err.message)
            })
    },

    updatePublicationsNumber: async function (id: UUID): Promise<Exception | string> {
        return await pool
            .query(`UPDATE ${schemaName} SET publications_number = (SELECT COUNT(*) FROM publications WHERE user_id = $1) WHERE id = $1`, [id])
            .then((res: any) => {
                console.log(infoLog(), postgresLog('Postgre', 'User publications number updated'))
                return 'User publications number updated'
            })
            .catch((err: any) => {
                console.log(error(), postgresLog('Postgre', `Error updating publications number`, err.stack))
                throw new Exception(400, err.message)
            })
    }
}