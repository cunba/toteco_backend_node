import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      PublicationDTO:
 *          properties:
 *              total_price:
 *                  type: number
 *              total_score:
 *                  type: number
 *              photo:
 *                  type: any
 *              establishment_id:
 *                  type: number
 *              user_id:
 *                  type: number
 */
export class PublicationDTO {
    total_price: number
    total_score: number
    photo: any
    establishment_id: UUID
    user_id: UUID

    constructor(
        total_price: number,
        total_score: number,
        photo: any,
        establishment_id: UUID,
        user_id: UUID
    ) {
        this.total_price = total_price
        this.total_score = total_score
        this.photo = photo
        this.establishment_id = establishment_id
        this.user_id = user_id
    }
}