import { UUID } from "crypto"
import { Publication } from "./publication"

/**
 * @openapi
 * components:
 *  schemas:
 *      Establishment:
 *          properties:
 *              id:
 *                  type: number
 *              name:
 *                  type: string
 *              creation_date:
 *                  type: number
 *              location:
 *                  type: string
 *              is_open:
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
    creation_date: number
    location: string
    is_open: boolean
    score: number
    publications?: Publication[]

    constructor(
        id: UUID,
        name: string,
        creation_date: number,
        location: string,
        is_open: boolean,
        score: number,
        publications?: Publication[]
    ) {
        this.id = id
        this.name = name
        this.creation_date = creation_date
        this.location = location
        this.is_open = is_open
        this.score = score
        this.publications = publications
    }

    toArray() {
        return [
            this.id,
            this.name,
            this.creation_date,
            this.location,
            this.is_open,
            this.score
        ]
    }
}