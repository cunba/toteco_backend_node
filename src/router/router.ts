import { Router } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { apiLog, infoLog } from "../constants/constants"
import establishmentsControllerRouter from "../controllers/establishmentsController"
import loginControllerRouter from "../controllers/loginController"
import menusControllerRouter from "../controllers/menuController"
import productsControllerRouter from "../controllers/productController"
import publicationsControllerRouter from "../controllers/publicationController"
import usersControllerRouter from "../controllers/userController"
import { usersRepository } from "../repository/users/usersRepository"

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

    const clientAuthMiddleware = () => async (req: any, res: any, next: any) => {
        try {
            const url = req.url
            const method = req.method
            const token = req.headers.authorization

            if ((url === '/Toteco/users' && method === 'POST') || url.includes('/Toteco/users/update-recovery-code')) {
                console.log(infoLog(), apiLog('Create user, no authorization needed'))
                next();
            } else if (token !== undefined && token !== null && token !== "") {
                console.log(infoLog(), apiLog('Token provided'))
                const tokenInfo = verify(token.replace('Bearer ', ''), 'toteco') as JwtPayload
                const userInfo = JSON.parse(tokenInfo.data)
                try {
                    await usersRepository.findById(userInfo.id)
                } catch (err: any) {
                    return res.sendStatus(401)
                }
                console.log(infoLog(), apiLog('Token valid'))
                next();
            } else {
                console.log(infoLog(), apiLog(`No token provided`))
                return res.sendStatus(401);
            }
        } catch (err: any) {
            console.log(err)
            return res.sendStatus(401)
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