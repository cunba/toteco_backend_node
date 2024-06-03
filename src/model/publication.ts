import { UUID } from "crypto"
import { establishmentsRepository } from "../repository/establishments/establishmentsRepository"
import { usersRepository } from "../repository/users/usersRepository"
import { Establishment } from "./establishment"
import { Product } from "./product"
import { User } from "./user"

/**
 * @openapi
 * components:
 *  schemas:
 *      Publication:
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *              created:
 *                  type: number
 *              updated:
 *                  type: number
 *              totalPrice:
 *                  type: number
 *              totalScore:
 *                  type: number
 *              photo:
 *                  type: string
 *              comment:
 *                  type: string
 *              establishment:
 *                  $ref: '#/components/schemas/Establishment'
 *              user:
 *                  $ref: '#/components/schemas/User'
 */
export class Publication {
    id?: UUID
    created?: number
    updated?: number | null
    totalPrice?: number
    totalScore?: number
    photo?: string
    comment?: string
    establishment?: Establishment
    user?: User
    products?: Product[]

    constructor(
        id?: UUID,
        created?: number,
        updated?: number | null,
        totalPrice?: number,
        totalScore?: number,
        photo?: any,
        comment?: string,
        establishment?: Establishment,
        user?: User
    ) {
        this.id = id
        this.created = created
        this.updated = updated
        this.totalPrice = totalPrice
        this.totalScore = totalScore
        this.photo = photo
        this.comment = comment
        this.establishment = establishment
        this.user = user
    }

    toArray() {
        return [
            this.id,
            this.created,
            this.updated,
            this.totalPrice,
            this.totalScore,
            this.photo,
            this.comment,
            this.establishment!.id,
            this.user!.id
        ]
    }

    async fromPostgre(publication: any) {
        this.id = publication.id
        this.created = publication.created
        this.updated = publication.updated
        this.totalPrice = publication.total_price
        this.totalScore = publication.total_score
        this.photo = publication.photo
        this.comment = publication.comment
        this.establishment = (await establishmentsRepository.findById(publication.establishment_id)) as Establishment
        this.user = (await usersRepository.findById(publication.user_id)) as User
    }
}