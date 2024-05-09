import { UUID } from "crypto"
import { Exception } from "../../model/exception"
import { User } from "../../model/user"
import { IRepositery } from "../iRepository"

export interface IUsersRepository extends IRepositery<User> {

    findByUsername: (username: string) => Promise<User[] | Exception>

    findByEmail: (email: string) => Promise<User[] | Exception>

    activate: (id: UUID) => Promise<string | Exception>

    disable: (id: UUID) => Promise<string | Exception>

    updateMoneySpent: (id: UUID) => Promise<string | Exception>

    updatePassword: (id: UUID, password: string) => Promise<string | Exception>

    updatePublicationsNumber: (id: UUID) => Promise<string | Exception>

}
