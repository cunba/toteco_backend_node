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
 *              date:
 *                  type: number
 *              total_price:
 *                  type: number
 *              total_score:
 *                  type: number
 *              photo:
 *                  type: any
 *              establishment:
 *                  $ref: '#/components/schemas/Establishment'
 *              user:
 *                  $ref: '#/components/schemas/User'
 */
export class Publication {
    id: UUID
    date: number
    total_price: number
    total_score: number
    photo: any
    establishment: Establishment
    user: User

    constructor(
        id: UUID,
        date: number,
        total_price: number,
        total_score: number,
        photo: any,
        establishment: Establishment,
        user: User
    ) {
        this.id = id
        this.date = date
        this.total_price = total_price
        this.total_score = total_score
        this.photo = photo
        this.establishment = establishment
        this.user = user
    }

    toArray() {
        return [
            this.id,
            this.date,
            this.total_price,
            this.total_score,
            this.photo,
            this.establishment.id,
            this.user.id
        ]
    }
}