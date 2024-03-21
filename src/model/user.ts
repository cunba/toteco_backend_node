import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              name:
 *                  type: string
 *              surname:
 *                  type: string
 *              birth_date:
 *                  type: number
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              creation_date:
 *                  type: number
 *              is_active:
 *                  type: boolean
 *              money_spent:
 *                  type: number
 *              publications_number:
 *                  type: number
 */
export class User {
    id: UUID
    name: string
    surname: string
    birth_date: number
    email: string
    password: string
    creation_date: number
    is_active: boolean
    money_spent: number
    publications_number: number
    recovering_code: number

    constructor(
        id: UUID,
        name: string,
        surname: string,
        birth_date: number,
        email: string,
        password: string,
        creation_date: number,
        is_active: boolean,
        money_spent: number,
        publications_number: number,
        recovering_code: number
    ) {
        this.id = id
        this.name = name
        this.surname = surname
        this.birth_date = birth_date
        this.email = email
        this.password = password
        this.creation_date = creation_date
        this.is_active = is_active
        this.money_spent = money_spent
        this.publications_number = publications_number
        this.recovering_code = recovering_code
    }

    toArray() {
        return [
            this.id,
            this.name,
            this.surname,
            this.birth_date,
            this.email,
            this.password,
            this.creation_date,
            this.is_active,
            this.money_spent,
            this.publications_number,
            this.recovering_code
        ]
    }
}