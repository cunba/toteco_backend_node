import { UUID } from "crypto"
import { Establishment } from "./establishment"
import { User } from "./user"

/**
 * @openapi
 * components:
 *  schemas:
 *      Publication:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              created:
 *                  type: number
 *              updated:
 *                  type: number
 *              totalPrice:
 *                  type: number
 *              totalScore:
 *                  type: number
 *              photo:
 *                  type: string
 *              establishment:
 *                  $ref: '#/components/schemas/Establishment'
 *              user:
 *                  $ref: '#/components/schemas/User'
 */
export class Publication {
    id: UUID
    created: number
    updated: number | null
    totalPrice: number
    totalScore: number
    photo: any
    establishment: Establishment
    user: User

    constructor(
        id: UUID,
        created: number,
        updated: number | null,
        totalPrice: number,
        totalScore: number,
        photo: any,
        establishment: Establishment,
        user: User
    ) {
        this.id = id
        this.created = created
        this.updated = updated
        this.totalPrice = totalPrice
        this.totalScore = totalScore
        this.photo = photo
        this.establishment = establishment
        this.user = user
    }

    toArray() {
        return [
            this.id,
            this.created,
            this.updated,
            this.totalPrice,
            this.totalScore,
            this.photo,
            this.establishment.id,
            this.user.id
        ]
    }
}