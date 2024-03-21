/**
 * @openapi
 * components:
 *  schemas:
 *      ProductDTO:
 *          properties:
 *              name:
 *                  type: string
 *              in_menu:
 *                  type: boolean
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 *              menu_id:
 *                  type: string
 *              publication_id:
 *                  type: number
 */
export class ProductDTO {
    name: string
    in_menu: boolean
    price?: number
    score?: number
    menu_id?: string
    publication_id?: number

    constructor(
        name: string,
        in_menu: boolean,
        price?: number,
        score?: number,
        menu_id?: string,
        publication_id?: number
    ) {
        this.name = name
        this.in_menu = in_menu
        this.price = price
        this.score = score
        this.menu_id = menu_id
        this.publication_id = publication_id
    }
}