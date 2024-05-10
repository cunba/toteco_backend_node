
/**
 * @openapi
 * components:
 *  schemas:
 *      LoginRequest:
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 */
export class LoginRequest {
    username: string
    password: string

    constructor(
        username: string,
        password: string
    ) {
        this.username = username
        this.password = password
    }
}