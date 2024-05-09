import { UUID } from "crypto"
import { Menu } from "./menu"
import { Publication } from "./publication"

/**
 * @openapi
 * components:
 *  schemas:
 *      Product:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              name:
 *                  type: string
 *              created:
 *                  type: number
 *              updated:
 *                  type: number
 *              in_menu:
 *                  type: boolean
 *              price:
 *                  type: number
 *              score:
 *                  type: number
 *              publication:
 *                  $ref: '#/components/schemas/Publication'
 *              menu:
 *                  $ref: '#/components/schemas/Menu'
 */
export class Product {
    id: UUID
    name: string
    created: number
    updated: number | null
    in_menu: boolean
    price: number
    score: number
    publication: Publication
    menu?: Menu

    constructor(
        id: UUID,
        name: string,
        created: number,
        updated: number | null,
        in_menu: boolean,
        price: number,
        score: number,
        publication: Publication,
        menu?: Menu
    ) {
        this.id = id
        this.name = name
        this.created = created
        this.updated = updated
        this.in_menu = in_menu
        this.price = price
        this.score = score
        this.publication = publication
        this.menu = menu
    }

    toArray() {
        return [
            this.id,
            this.name,
            this.created,
            this.updated,
            this.in_menu,
            this.price,
            this.score,
            this.publication.id,
            this.menu ? this.menu.id : null
        ]
    }
}