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
 *              recoveryCode:
 *                  type: number
 */
export class RecoverAccount {
    id: UUID
    username: string
    recoveryCode: number | null

    constructor(
        id: UUID,
        username: string,
        recoveryCode: number | null
    ) {
        this.id = id
        this.username = username
        this.recoveryCode = recoveryCode
    }
}