import { Pool } from "pg";
import { POSTGRE_DATABASE, POSTGRE_HOST, POSTGRE_PASSWORD, POSTGRE_PORT, POSTGRE_USER } from "../config/environments";
import { error, info, postgresLog } from "../constants/constants";

export const pool = new Pool({
    user: POSTGRE_USER,
    host: POSTGRE_HOST,
    database: POSTGRE_DATABASE,
    password: POSTGRE_PASSWORD,
    port: POSTGRE_PORT,
});

export const databaseClient = async () => {
    await pool
        .query(
            `CREATE TABLE IF NOT EXISTS establishments(
                id UUID PRIMARY KEY,
                name VARCHAR(30),
                created BIGINT,
                updated BIGINT NULL,
                location VARCHAR(50),
                is_open BOOLEAN,
                score DECIMAL(3,1)
            );`
        )
        .then((res: any) => console.log(info(), postgresLog('Postgre', 'establishments table created if not exists')))
        .catch((err: any) => console.log(error(), postgresLog('Postgre', 'Error creating establishments table')))

    await pool
        .query(
            `CREATE TABLE IF NOT EXISTS menus(
                id UUID PRIMARY KEY,
                created BIGINT,
                updated BIGINT NULL,
                price DECIMAL(4,2),
                score DECIMAL(3,1)
            );`
        )
        .then((res: any) => console.log(info(), postgresLog('Postgre', 'menus table created if not exists')))
        .catch((err: any) => console.log(error(), postgresLog('Postgre', 'Error creating menus table')))

    await pool
        .query(
            `CREATE TABLE IF NOT EXISTS users(
                id UUID PRIMARY KEY,
                username VARCHAR(30),
                name VARCHAR(30),
                surname VARCHAR(30),
                birth_date BIGINT,
                email VARCHAR(50),
                password VARCHAR(100),
                created BIGINT,
                updated BIGINT NULL,
                photo VARCHAR(200),
                is_active BOOLEAN,
                money_spent DECIMAL(8,2),
                publications_number INTEGER,
                role VARCHAR(10),
                recovery_code NUMERIC(5) NULL
            );`
        )
        .then((res: any) => console.log(info(), postgresLog('Postgre', 'users table created if not exists')))
        .catch((err: any) => console.log(error(), postgresLog('Postgre', 'Error creating users table')))

    await pool
        .query(
            `CREATE TABLE IF NOT EXISTS publications(
                id UUID PRIMARY KEY,
                created BIGINT,
                updated BIGINT NULL,
                total_price DECIMAL(5,2),
                total_score DECIMAL(3,1),
                photo VARCHAR(200),
                establishment_id UUID,
                user_id UUID,
                CONSTRAINT fk_establishment_id
                FOREIGN KEY (establishment_id)
                REFERENCES establishments(id)
                ON DELETE SET NULL,
                CONSTRAINT fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL
            );`
        )
        .then((res: any) => console.log(info(), postgresLog('Postgre', 'publications table created if not exists')))
        .catch((err: any) => console.log(error(), postgresLog('Postgre', 'Error creating publications table')))

    await pool
        .query(
            `CREATE TABLE IF NOT EXISTS products(
                id UUID PRIMARY KEY,
                name VARCHAR(50),
                created BIGINT,
                updated BIGINT NULL,
                in_menu BOOLEAN,
                price DECIMAL(4,2),
                score DECIMAL(3,1),
                menu_id UUID,
                publication_id UUID,
                CONSTRAINT fk_menu_id
                FOREIGN KEY (menu_id)
                REFERENCES menus(id)
                ON DELETE SET NULL,
                CONSTRAINT fk_publication_id
                FOREIGN KEY (publication_id)
                REFERENCES publications(id)
                ON DELETE SET NULL
            );`
        )
        .then((res: any) => console.log(info(), postgresLog('Postgre', 'products table created if not exists')))
        .catch((err: any) => console.log(error(), postgresLog('Postgre', 'Error creating products table')))
}
