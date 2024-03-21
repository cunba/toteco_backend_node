/**
 * @openapi
 * components:
 *  schemas:
 *      MenuDTO:
 *          properties:
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 */
export class MenuDTO {
    price: number
    score: number

    constructor(
        price: number,
        score: number
    ) {
        this.price = price
        this.score = score
    }
}