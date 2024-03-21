import { Product } from "./product"

/**
 * @openapi
 * components:
 *  schemas:
 *      Menu:
 *          properties:
 *              id:
 *                  type: number
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
    id: number
    date: number
    price: number
    score: number
    products?: Product[]

    constructor(
        id: number,
        date: number,
        price: number,
        score: number
    ) {
        this.id = id
        this.date = date
        this.price = price
        this.score = score
    }
}