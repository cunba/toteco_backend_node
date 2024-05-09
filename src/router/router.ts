import { Router } from "express"
import { apiLog, info } from "../constants/constants"
import establishmentsControllerRouter from "../controllers/establishmentsController"

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
            let url = req.url
            let method = req.method
            let token = req.headers.authorization.trim()

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

    // router.use(clientAuthMiddleware())
    router.use('/Toteco', establishmentsControllerRouter)

    return router
}