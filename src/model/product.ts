/**
 * @openapi
 * components:
 *  schemas:
 *      Product:
 *          properties:
 *              id:
 *                  type: number
 *              name:
 *                  type: string
 *              date:
 *                  type: number
 *              in_menu:
 *                  type: boolean
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 */
export class Product {
    id: number
    name: string
    date: number
    in_menu: boolean
    price?: number
    score?: number

    constructor(
        id: number,
        name: string,
        date: number,
        in_menu: boolean,
        price: number,
        score: number
    ) {
        this.id = id
        this.name = name
        this.date = date
        this.in_menu = in_menu
        this.price = price
        this.score = score
    }
}