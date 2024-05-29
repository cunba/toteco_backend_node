import { Establishment } from "../../model/establishment"
import { Exception } from "../../model/exception"
import { IRepositery } from "../iRepository"

export interface IEstablishmentsRepository extends IRepositery<Establishment> {

    findByName: (name: string) => Promise<Establishment[] | Exception>

    findByMapsId: (mapsId: string) => Promise<Establishment[] | Exception>
}
