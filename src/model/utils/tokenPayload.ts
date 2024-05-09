import { UUID } from "crypto"

export class TokenPayload {
    id: UUID
    username: string
    email: string
    role: string

    constructor(
        id: UUID,
        username: string,
        email: string,
        role: string
    ) {
        this.id = id
        this.username = username
        this.email = email
        this.role = role
    }
}