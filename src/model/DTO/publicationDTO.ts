import { UUID } from "crypto"

/**
 * @openapi
 * components:
 *  schemas:
 *      PublicationDTO:
 *          properties:
 *              totalPrice:
 *                  type: number
 *              totalScore:
 *                  type: number
 *              photo:
 *                  type: string
 *              comment:
 *                  type: string
 *              establishmentId:
 *                  type: string
 *                  format: uuid
 *              userId:
 *                  type: string
 *                  format: uuid
 */
export class PublicationDTO {
    totalPrice: number
    totalScore: number
    photo: any
    comment: string
    establishmentId: UUID
    userId: UUID

    constructor(
        totalPrice: number,
        totalScore: number,
        photo: any,
        comment: string,
        establishmentId: UUID,
        userId: UUID
    ) {
        this.totalPrice = totalPrice
        this.totalScore = totalScore
        this.photo = photo
        this.comment = comment
        this.establishmentId = establishmentId
        this.userId = userId
    }
}