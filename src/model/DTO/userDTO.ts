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
 *              birthDate:
 *                  type: number
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              photo:
 *                  type: string
 *              role:
 *                  type: string
 */
export class UserDTO {
    username: string
    name: string
    surname: string
    birthDate: number
    email: string
    password: string
    photo: string
    role: string

    constructor(
        username: string,
        name: string,
        surname: string,
        birthDate: number,
        email: string,
        password: string,
        photo: string,
        role: string
    ) {
        this.username = username
        this.name = name
        this.surname = surname
        this.birthDate = birthDate
        this.email = email
        this.password = password
        this.photo = photo
        this.role = role
    }
}