/**
 * @openapi
 * components:
 *  schemas:
 *      UserDTO:
 *          properties:
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
 *              role:
 *                  type: string
 */
export class UserDTO {
    username: string
    name: string
    surname: string
    birth_date: number
    email: string
    password: string
    role: string

    constructor(
        username: string,
        name: string,
        surname: string,
        birth_date: number,
        email: string,
        password: string,
        role: string
    ) {
        this.username = username
        this.name = name
        this.surname = surname
        this.birth_date = birth_date
        this.email = email
        this.password = password
        this.role = role
    }
}