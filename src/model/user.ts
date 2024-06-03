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
 *              birthDate:
 *                  type: number
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              created:
 *                  type: number
 *              updated:
 *                  type: number
 *              photo:
 *                  type: string
 *              isActive:
 *                  type: boolean
 *              moneySpent:
 *                  type: number
 *              publicationsNumber:
 *                  type: number
 *              role:
 *                  type: string
 *              recoveryCode:
 *                  type: number
 */
export class User {
    id?: UUID
    username?: string
    name?: string
    surname?: string
    birthDate?: number
    email?: string
    password?: string
    created?: number
    updated?: number | null
    photo?: any
    isActive?: boolean
    moneySpent?: number
    publicationsNumber?: number
    role?: string
    recoveryCode?: number | null

    constructor(
        id?: UUID,
        username?: string,
        name?: string,
        surname?: string,
        birthDate?: number,
        email?: string,
        password?: string,
        created?: number,
        updated?: number | null,
        photo?: any,
        isActive?: boolean,
        moneySpent?: number,
        publicationsNumber?: number,
        role?: string,
        recoveryCode?: number | null
    ) {
        this.id = id
        this.username = username
        this.name = name
        this.surname = surname
        this.birthDate = birthDate
        this.email = email
        this.password = password
        this.created = created
        this.updated = updated
        this.photo = photo
        this.isActive = isActive
        this.moneySpent = moneySpent
        this.publicationsNumber = publicationsNumber
        this.role = role
        this.recoveryCode = recoveryCode
    }

    toArray() {
        return [
            this.id,
            this.username,
            this.name,
            this.surname,
            this.birthDate,
            this.email,
            this.password,
            this.created,
            this.updated,
            this.photo,
            this.isActive,
            this.moneySpent,
            this.publicationsNumber,
            this.role,
            this.recoveryCode
        ]
    }

    fromPostgre(user: any) {
        this.id = user.id
        this.username = user.username
        this.name = user.name
        this.surname = user.surname
        this.birthDate = user.birth_date
        this.email = user.email
        this.password = user.password
        this.created = user.created
        this.updated = user.updated
        this.photo = user.photo
        this.isActive = user.is_active
        this.moneySpent = user.money_spent
        this.publicationsNumber = user.publications_number
        this.role = user.role
        this.recoveryCode = user.recovery_code
    }
}