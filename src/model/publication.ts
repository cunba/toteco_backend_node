import { Establishment } from "./establishment"
import { User } from "./user"

/**
 * @openapi
 * components:
 *  schemas:
 *      Publication:
 *          properties:
 *              id:
 *                  type: number
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
    id: number
    date: number
    total_price: number
    total_score: number
    photo: any
    establishment: Establishment
    user: User

    constructor(
        id: number,
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
}