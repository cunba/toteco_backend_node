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
            // Get the Certificate the User provided
            let cert = req.socket.getPeerCertificate();
            // The Certificate is VALID
            if (req.client.authorized) {
                console.log(info(), apiLog(`Certificate "${cert.subject.CN}" is VALID and was issued by "${cert.issuer.CN}"`))
                next();
            }
            // The Certificate is NOT VALID
            else if (cert.subject) {
                console.log(info(), apiLog(`Certificates from "${cert.issuer.CN}" are NOT VALID. User "${cert.subject.CN}"`))
                res.sendStatus(401);
            }
            // A Certificate was NOT PROVIDED
            else {
                console.log(info(), apiLog(`No Certificate provided by the client`))
                res.status(403).send(`Certificate Required`)
            }
        } catch (err: any) {
            res.sendStatus(404)
        }
    }

    // router.use(clientAuthMiddleware())
    router.use('/Toteco', establishmentsControllerRouter)

    return router
}