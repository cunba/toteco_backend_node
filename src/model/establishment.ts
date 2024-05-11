import { UUID } from "crypto"
import { Publication } from "./publication"

/**
 * @openapi
 * components:
 *  schemas:
 *      Establishment:
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
 *              location:
 *                  type: string
 *              isOpen:
 *                  type: boolean
 *              score:
 *                  type: number
 *              publications:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Product'
 */
export class Establishment {
    id: UUID
    name: string
    created: number
    updated: number | null
    location: string
    isOpen: boolean
    score: number
    publications?: Publication[]

    constructor(
        id: UUID,
        name: string,
        created: number,
        updated: number | null,
        location: string,
        isOpen: boolean,
        score: number,
        publications?: Publication[]
    ) {
        this.id = id
        this.name = name
        this.created = created
        this.updated = updated
        this.location = location
        this.isOpen = isOpen
        this.score = score
        this.publications = publications
    }

    toArray() {
        return [
            this.id,
            this.name,
            this.created,
            this.updated,
            this.location,
            this.isOpen,
            this.score
        ]
    }
}