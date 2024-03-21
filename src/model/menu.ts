import { UUID } from "crypto"
import { Product } from "./product"

/**
 * @openapi
 * components:
 *  schemas:
 *      Menu:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              date:
 *                  type: number
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 *              products:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Product'
 */
export class Menu {
    id: UUID
    date: number
    price: number
    score: number
    products?: Product[]

    constructor(
        id: UUID,
        date: number,
        price: number,
        score: number
    ) {
        this.id = id
        this.date = date
        this.price = price
        this.score = score
    }

    toArray() {
        return [
            this.id,
            this.date,
            this.price,
            this.score
        ]
    }
}