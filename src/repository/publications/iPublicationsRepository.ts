import { UUID } from "crypto"
import { Exception } from "../../model/exception"
import { Publication } from "../../model/publication"
import { IRepositery } from "../iRepository"

export interface IPublicationsRepository extends IRepositery<Publication> {

    findByEstablishment: (establishmentId: UUID) => Promise<Publication[] | Exception>

    findByUser: (userId: UUID) => Promise<Publication[] | Exception>

    findTotalScoreByEstablishment: (establishmentId: UUID) => Promise<number | Exception>

}
