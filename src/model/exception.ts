/**
 * @openapi
 * components:
 *  schemas:
 *      Exception:
 *          properties:
 *              code:
 *                  type: number
 *              errors:
 *                  type: object
 *                  additionalProperties:
 *                      type: string
 *              message:
 *                  type: string
 */
export class Exception {
    code: number
    errors?: Map<string, string>
    message: string

    constructor(
        code: number,
        message: string,
        errors?: Map<string, string>
    ) {
        this.code = code
        this.message = message
        this.errors = errors
    }
}