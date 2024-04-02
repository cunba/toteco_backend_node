import { UUID } from "crypto"
import { Exception } from "../../model/exception"
import { Product } from "../../model/product"
import { IRepositery } from "../iRepository"

export interface IProductsRepository extends IRepositery<Product> {

    findByMenu: (menuId: UUID) => Promise<Product[] | Exception>

    findByPublication: (publicationId: UUID) => Promise<Product[] | Exception>

}
