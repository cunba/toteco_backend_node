
/**
 * @openapi
 * components:
 *  schemas:
 *      LoginResponse:
 *          properties:
 *              token:
 *                  type: string
 */
export class LoginResponse {
    token: string

    constructor(
        token: string
    ) {
        this.token = token
    }
}