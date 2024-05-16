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
 *              menuId:
 *                  type: string
 *                  format: uuid
 *              publicationId:
 *                  type: string
 *                  format: uuid
 */
export class ProductDTO {
    name: string
    inMenu: boolean
    price?: number
    score?: number
    menuId?: UUID
    publicationId?: UUID

    constructor(
        name: string,
        inMenu: boolean,
        price?: number,
        score?: number,
        menuId?: UUID,
        publicationId?: UUID
    ) {
        this.name = name
        this.inMenu = inMenu
        this.price = price
        this.score = score
        this.menuId = menuId
        this.publicationId = publicationId
    }
}