import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      ProductDTO:
 *          properties:
 *              name:
 *                  type: string
 *              inMenu:
 *                  type: boolean
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 *              menu_id:
 *                  type: string
 *                  format: uuid
 *              publication_id:
 *                  type: string
 *                  format: uuid
 */
export class ProductDTO {
    name: string
    inMenu: boolean
    price?: number
    score?: number
    menu_id?: UUID
    publication_id?: UUID

    constructor(
        name: string,
        inMenu: boolean,
        price?: number,
        score?: number,
        menu_id?: UUID,
        publication_id?: UUID
    ) {
        this.name = name
        this.inMenu = inMenu
        this.price = price
        this.score = score
        this.menu_id = menu_id
        this.publication_id = publication_id
    }
}