/**
 * @openapi
 * components:
 *  schemas:
 *      EstablishmentDTO:
 *          properties:
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              isComputerAllowed:
 *                  type: boolean
 *              comments:
 *                  type: string
 */
export class EstablishmentDTO {
    name: string
    location: string
    isComputerAllowed: boolean
    comments?: string

    constructor(
        name: string,
        location: string,
        isComputerAllowed: boolean,
        comments?: string
    ) {
        this.name = name
        this.location = location
        this.isComputerAllowed = isComputerAllowed
        this.comments = comments
    }
}