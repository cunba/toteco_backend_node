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
 *              username:
 *                  type: string
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
 *              created:
 *                  type: number
 *              updated:
 *                  type: number
 *              is_active:
 *                  type: boolean
 *              money_spent:
 *                  type: number
 *              publications_number:
 *                  type: number
 *              role:
 *                  type: string
 *              recovery_code:
 *                  type: string
 */
export class User {
    id: UUID
    username: string
    name: string
    surname: string
    birth_date: number
    email: string
    password: string
    created: number
    updated: number | null
    is_active: boolean
    money_spent: number
    publications_number: number
    role: string
    recovery_code: number | null

    constructor(
        id: UUID,
        username: string,
        name: string,
        surname: string,
        birth_date: number,
        email: string,
        password: string,
        created: number,
        updated: number | null,
        is_active: boolean,
        money_spent: number,
        publications_number: number,
        role: string,
        recovery_code: number | null
    ) {
        this.id = id
        this.username = username
        this.name = name
        this.surname = surname
        this.birth_date = birth_date
        this.email = email
        this.password = password
        this.created = created
        this.updated = updated
        this.is_active = is_active
        this.money_spent = money_spent
        this.publications_number = publications_number
        this.role = role
        this.recovery_code = recovery_code
    }

    toArray() {
        return [
            this.id,
            this.username,
            this.name,
            this.surname,
            this.birth_date,
            this.email,
            this.password,
            this.created,
            this.updated,
            this.is_active,
            this.money_spent,
            this.publications_number,
            this.role,
            this.recovery_code
        ]
    }
}