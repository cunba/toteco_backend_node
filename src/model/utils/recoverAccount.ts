import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      RecoverAccount:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              username:
 *                  type: string
 *              recovery_code:
 *                  type: number
 */
export class RecoverAccount {
    id: UUID
    username: string
    recovery_code: number | null

    constructor(
        id: UUID,
        username: string,
        recovery_code: number | null
    ) {
        this.id = id
        this.username = username
        this.recovery_code = recovery_code
    }
}