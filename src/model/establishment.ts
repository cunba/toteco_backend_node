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
 *              isComputerAllowed:
 *                  type: boolean
 *              mapsId:
 *                  type: string
 *              score:
 *                  type: number
 *              publications:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Product'
 */
export class Establishment {
    id?: UUID
    name?: string
    created?: number
    updated?: number | null
    location?: string
    isOpen?: boolean
    isComputerAllowed?: boolean
    mapsId?: string
    score?: number
    publications?: Publication[]

    constructor(
        id?: UUID,
        name?: string,
        created?: number,
        updated?: number | null,
        location?: string,
        isOpen?: boolean,
        isComputerAllowed?: boolean,
        mapsId?: string,
        score?: number,
        publications?: Publication[]
    ) {
        this.id = id
        this.name = name
        this.created = created
        this.updated = updated
        this.location = location
        this.isOpen = isOpen
        this.isComputerAllowed = isComputerAllowed
        this.mapsId = mapsId
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
            this.isComputerAllowed,
            this.mapsId,
            this.score
        ]
    }

    fromPostgre(establishment: any) {
        this.id = establishment.id
        this.name = establishment.name
        this.created = establishment.created
        this.updated = establishment.updated
        this.location = establishment.location
        this.isOpen = establishment.is_open
        this.isComputerAllowed = establishment.is_computer_allowed
        this.mapsId = establishment.maps_id
        this.score = establishment.score
    }
}