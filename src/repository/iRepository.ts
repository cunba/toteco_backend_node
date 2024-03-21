import { UUID } from "crypto"
import { Exception } from "../model/exception"

export interface IRepositery<T> {
    save: (T: T) => Promise<Exception>

    update: (T: T) => Promise<number | Exception>

    delete: (id: UUID) => Promise<number | Exception>

    deleteAll: () => Promise<number | Exception>

    findById: (id: UUID) => Promise<T | Exception>

    findAll: () => Promise<T[] | Exception>
}