import { compareSync } from "bcrypt"
import { json } from "body-parser"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { sign } from "jsonwebtoken"
import { apiLog, error, infoLog } from "../constants/constants"
import { Exception } from "../model/exception"
import { LoginRequest } from "../model/utils/loginRequest"
import { LoginResponse } from "../model/utils/loginResponse"
import { TokenPayload } from "../model/utils/tokenPayload"
import { usersRepository } from "../repository/users/usersRepository"

const loginControllerRouter = Router()

/**
 * @openapi
 * /login:
 *  post:
 *      description: Login
 *      operationId: login
 *      tags:
 *      - Login
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginRequest'
 *      responses:
 *          200:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginResponse'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          500:
 *              description: INTERNAL SERVER ERROR
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 */
loginControllerRouter.post('/login', json(),
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    async (req, res) => {
        console.log(infoLog(), apiLog('Api', '\t', 'Login request'))

        const errors: any = validationResult(req)
        if (!errors.isEmpty()) {
            const exception = new Exception(400, 'Bad Request', new Map())
            errors.array().map((e: ValidationError, index: number) => {
                if (e.value !== undefined) {
                    exception.errors?.set(e.param, 'type error')
                } else {
                    exception.errors?.set(e.param, 'required but not provided')
                }
            })
            console.log(error(), apiLog('Api', '\t', 'New product request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const loginRequest = req.body as LoginRequest

        try {
            let user = await usersRepository.findByUsername(loginRequest.username)
            if (!(user instanceof Exception) && user.length > 0) {
                if (compareSync(loginRequest.password, user[0].password!)) {
                    const tokenPayload = new TokenPayload(user[0].id!, user[0].username!, user[0].email!, user[0].role!)
                    const token = sign({ data: JSON.stringify(tokenPayload) }, 'toteco', { expiresIn: '24h' })
                    const loginResponse = new LoginResponse(token)
                    console.log(infoLog(), apiLog('User found, credentials ok'))
                    return res.status(200).send(loginResponse)
                } else {
                    console.log(error(), apiLog('Invalid password'))
                    return res.status(400).send(new Exception(400, 'Invalid password'))
                }
            } else {
                user = await usersRepository.findByEmail(loginRequest.username.toLowerCase())
                if (!(user instanceof Exception)) {
                    if (compareSync(loginRequest.password, user[0].password!)) {
                        const tokenPayload = new TokenPayload(user[0].id!, user[0].username!, user[0].email!, user[0].role!)
                        const token = sign({ data: JSON.stringify(tokenPayload) }, 'toteco', { expiresIn: '24h' })
                        const loginResponse = new LoginResponse(token)
                        console.log(infoLog(), apiLog('User found, credentials ok'))
                        return res.status(200).send(loginResponse)
                    } else {
                        console.log(error(), apiLog('Invalid password'))
                        return res.status(400).send(new Exception(400, 'Invalid password'))
                    }
                }
            }
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

export default loginControllerRouter