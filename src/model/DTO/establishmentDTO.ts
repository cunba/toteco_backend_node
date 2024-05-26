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
 *              mapsId:
 *                  type: string
 */
export class EstablishmentDTO {
    name: string
    location: string
    isComputerAllowed: boolean
    mapsId: string

    constructor(
        name: string,
        location: string,
        isComputerAllowed: boolean,
        mapsId: string
    ) {
        this.name = name
        this.location = location
        this.isComputerAllowed = isComputerAllowed
        this.mapsId = mapsId
    }
}