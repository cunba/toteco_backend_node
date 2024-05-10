import { Router } from "express"
import { apiLog, info } from "../constants/constants"
import establishmentsControllerRouter from "../controllers/establishmentsController"
import loginControllerRouter from "../controllers/loginController"
import menusControllerRouter from "../controllers/menuController"
import productsControllerRouter from "../controllers/productController"
import publicationsControllerRouter from "../controllers/publicationController"
import usersControllerRouter from "../controllers/userController"

/**
 * This client creates the router configuration base on the environments provided
 * @param restApiConfig - Rest Api environment configuration provided in config folder
 * @returns router
 */
export const routerClient = () => {

    const router = Router()

    router.use((req, res, next) => {
        next()
    })

    const clientAuthMiddleware = () => (req: any, res: any, next: any) => {
        try {
            const url = req.url
            console.log(url)
            const token = req.headers.authorization.trim()
            console.log(token)

            if (token !== undefined || token !== null || token !== "") {
                console.log(info(), apiLog('Token provided'))
                next();
            } else {
                console.log(info(), apiLog(`No token provided`))
                res.sendStatus(401);
            }
        } catch (err: any) {
            res.sendStatus(404)
        }
    }

    router.use('/Toteco', loginControllerRouter)
    router.use(clientAuthMiddleware())
    router.use('/Toteco', establishmentsControllerRouter)
    router.use('/Toteco', menusControllerRouter)
    router.use('/Toteco', productsControllerRouter)
    router.use('/Toteco', publicationsControllerRouter)
    router.use('/Toteco', usersControllerRouter)

    return router
}