/**
 * @openapi
 * components:
 *  schemas:
 *      UserDTO:
 *          properties:
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
 *              is_active:
 *                  type: boolean
 */
export class UserDTO {
    name: string
    surname: string
    birth_date: number
    email: string
    password: string
    is_active: boolean

    constructor(
        name: string,
        surname: string,
        birth_date: number,
        email: string,
        password: string,
        is_active: boolean
    ) {
        this.name = name
        this.surname = surname
        this.birth_date = birth_date
        this.email = email
        this.password = password
        this.is_active = is_active
    }
}