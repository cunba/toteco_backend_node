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
 *              created:
 *                  type: number
 *              updated:
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
    created: number
    updated: number | null
    price: number
    score: number
    products?: Product[]

    constructor(
        id: UUID,
        created: number,
        updated: number | null,
        price: number,
        score: number
    ) {
        this.id = id
        this.created = created
        this.updated = updated
        this.price = price
        this.score = score
    }

    toArray() {
        return [
            this.id,
            this.created,
            this.updated,
            this.price,
            this.score
        ]
    }
}