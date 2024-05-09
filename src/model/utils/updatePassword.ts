import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      UpdatePassword:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              password:
 *                  type: string
 */
export class UpdatePassword {
    id: UUID
    password: string

    constructor(
        id: UUID,
        password: string
    ) {
        this.id = id
        this.password = password
    }
}