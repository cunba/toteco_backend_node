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
 */
export class EstablishmentDTO {
    name: string
    location: string

    constructor(
        name: string,
        location: string
    ) {
        this.name = name
        this.location = location
    }
}