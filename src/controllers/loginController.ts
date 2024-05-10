import { json } from "body-parser"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { sign } from "jsonwebtoken"
import { apiLog, error, info } from "../constants/constants"
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
        console.log(info(), apiLog('Api', '\t', 'Login request:'))
        console.log('\t\t', apiLog(JSON.stringify(req.body)))

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
            const user = await usersRepository.findByUsername(loginRequest.username)
            if (user instanceof Exception) {
                return res.status(user.code).send(user)
            } else {
                console.log(user[0].password)
                console.log(loginRequest.password)
                if (user[0].password === loginRequest.password) {
                    const token = sign(new TokenPayload(user[0].id, user[0].username, user[0].email, user[0].role), 'toteco')
                    const loginResponse = new LoginResponse(token)
                    return res.status(200).send(loginResponse)
                } else {
                    return res.status(401).send(new Exception(400, 'Invalid password'))
                }
            }
        } catch (err: any) {
            try {
                const user = await usersRepository.findByEmail(loginRequest.username)
                if (user instanceof Exception) {
                    return res.status(user.code).send(user)
                } else {
                    console.log(user[0].password)
                    console.log(loginRequest.password)
                    if (user[0].password === loginRequest.password) {
                        const token = sign(new TokenPayload(user[0].id, user[0].username, user[0].email, user[0].role), 'toteco')
                        const loginResponse = new LoginResponse(token)
                        return res.status(200).send(loginResponse)
                    } else {
                        return res.status(401).send(new Exception(400, 'Invalid password'))
                    }
                }
            } catch (err: any) {
                return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
            }
        }

    })

export default loginControllerRouter