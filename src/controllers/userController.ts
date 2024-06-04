import { hashSync } from "bcrypt"
import { json } from "body-parser"
import { randomInt, randomUUID, UUID } from "crypto"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { decode } from "jsonwebtoken"
import { createTransport } from "nodemailer"
import { apiLog, error, infoLog } from "../constants/constants"
import { UserDTO } from "../model/DTO/userDTO"
import { Exception } from "../model/exception"
import { User } from "../model/user"
import { RecoverAccount } from "../model/utils/recoverAccount"
import { TokenPayload } from "../model/utils/tokenPayload"
import { UpdatePassword } from "../model/utils/updatePassword"
import { usersRepository } from "../repository/users/usersRepository"

const usersControllerRouter = Router()

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'veda28@ethereal.email',
        pass: '7Y17yEurnjVArsGGpJ'
    }
});

/**
 * @openapi
 * /users:
 *  post:
 *      description: Create new user
 *      operationId: saveUser
 *      tags:
 *      - Users
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserDTO'
 *      responses:
 *          201:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.post('/users', json(),
    body('username').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('birthDate').trim().notEmpty().isNumeric(),
    body('email').trim().notEmpty(),
    body('password').trim().notEmpty(),
    body('role').trim().notEmpty(),
    async (req, res) => {
        console.log(infoLog(), apiLog('Api', '\t', 'New user request'))

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
            console.log(error(), apiLog('Api', '\t', 'New user request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const userDTO = req.body as UserDTO
        const passwordEncrypted = hashSync(userDTO.password, 10)

        let userExists = await usersRepository.findByEmail(userDTO.email)
        if (userExists instanceof Array && userExists.length > 0) {
            console.log(error(), apiLog('User already exists'))
            return res.status(400).send(new Exception(400, 'User already exists'))
        } else {
            userExists = await usersRepository.findByUsername(userDTO.username)
            if (userExists instanceof Array && userExists.length > 0) {
                console.log(error(), apiLog('User already exists'))
                return res.status(400).send(new Exception(400, 'User already exists'))
            }
        }

        const user = new User(
            randomUUID(),
            userDTO.username.toLowerCase(),
            userDTO.name,
            userDTO.surname,
            userDTO.birthDate,
            userDTO.email.toLowerCase(),
            passwordEncrypted,
            new Date().getTime(),
            null,
            userDTO.photo,
            true,
            0,
            0,
            userDTO.role,
            randomInt(10000, 100000)
        )

        await transporter.sendMail({
            from: '"TOTECO" <veda28@ethereal.email>', // sender address
            to: userDTO.email, // list of receivers
            subject: "CODE", // Subject line
            text: `The code is: ${user.recoveryCode}`, // plain text body
        });

        try {
            await usersRepository.save(user)
            return res.status(201).send(user)
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

/**
 * @openapi
 * /users:
 *  put:
 *      security:
 *      - BearerAuth: []
 *      description: Update user
 *      operationId: updateUser
 *      tags:
 *      - Users
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *                          format: int64
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          404:
 *              description: NOT FOUND
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
usersControllerRouter.put('/users', json(),
    body('username').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('surname').trim().notEmpty(),
    body('birthDate').trim().notEmpty().isNumeric(),
    body('email').trim().notEmpty(),
    body('password').trim().notEmpty(),
    body('role').trim().notEmpty(),
    async (req, res) => {
        console.log(infoLog(), apiLog('Api', '\t', 'Update user request'))

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
            console.log(error(), apiLog('Api', '\t', 'New user request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const user = req.body as User

        try {
            await usersRepository.findById(user.id!)
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(404).send(err ?? new Exception(404, err.message ?? 'Not found exception'))
        }

        try {
            const response = await usersRepository.update(user)
            return res.status(200).send(response)
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

/**
 * @openapi
 * /users:
 *  delete:
 *      security:
 *      - BearerAuth: []
 *      description: Delete all users
 *      operationId: deleteAllUsers
 *      tags:
 *      - Users
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *                          format: int64
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.delete('/users', json(), async (req, res) => {
    try {
        const response = await usersRepository.deleteAll()
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/id/{id}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get user by id
 *      operationId: getUserById
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *                format: uuid
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/id/:id', json(), async (req, res) => {
    try {
        const response = await usersRepository.findById(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/username/{username}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get user by username
 *      operationId: getUserByUsername
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/username/:username', json(), async (req, res) => {
    try {
        const response = await usersRepository.findByUsername(req.params.username.toLowerCase())
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/email/{email}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get user by email
 *      operationId: getUserByEmail
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: email
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/email/:email', json(), async (req, res) => {
    try {
        const response = await usersRepository.findByEmail(req.params.email.toLowerCase())
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/logged:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get user logged
 *      operationId: getUserLogged
 *      tags:
 *      - Users
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/logged', json(), async (req, res) => {
    try {
        let token = req.headers.authorization
        const tokenPayload = JSON.parse((decode(token!.replace('Bearer ', '')) as any).data) as TokenPayload
        const response = await usersRepository.findById(tokenPayload.id)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get all users
 *      operationId: getAllUser
 *      tags:
 *      - Users
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users', json(), async (req, res) => {
    try {
        const response = await usersRepository.findAll()
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/recover-account/{email}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Recover account
 *      operationId: recoverAccount
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: email
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/RecoverAccount'
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/recover-account/:email', json(), async (req, res) => {
    try {
        const user = await usersRepository.findByEmail(req.params.email.toLowerCase())
        let recoverAccount = null
        if (user instanceof User)
            recoverAccount = new RecoverAccount(user.id!, user.username!.toLowerCase(), user.recoveryCode!)
        return res.status(200).send(recoverAccount)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/activate/{id}:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Activate user
 *      operationId: activate
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.patch('/users/activate/:id', json(), async (req, res) => {
    try {
        const response = await usersRepository.activate(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/disable/{id}:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Disable user
 *      operationId: disable
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.patch('/users/disable/:id', json(), async (req, res) => {
    try {
        const response = await usersRepository.disable(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/update-money-spent/{id}:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Update money spent
 *      operationId: updateMoneySpent
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.patch('/users/update-money-spent/:id', json(), async (req, res) => {
    try {
        await usersRepository.findById(req.params.id as UUID)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(404).send(err ?? new Exception(404, err.message ?? 'Not found exception'))
    }

    try {
        const response = await usersRepository.updateMoneySpent(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/update-publications-number/{id}:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Update number of publications
 *      operationId: updatePublicationsNumber
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.patch('/users/update-publications-number/:id', json(), async (req, res) => {
    try {
        await usersRepository.findById(req.params.id as UUID)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(404).send(err ?? new Exception(404, err.message ?? 'Not found exception'))
    }

    try {
        const response = await usersRepository.updatePublicationsNumber(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/update-recovery-code/{id}/{code}:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Update recovery code
 *      operationId: updateRecoveryCode
 *      tags:
 *      - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *          - in: path
 *            name: code
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.patch('/users/update-recovery-code/:id/:code', json(), async (req, res) => {
    try {
        await usersRepository.findById(req.params.id as UUID)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(404).send(err ?? new Exception(404, err.message ?? 'Not found exception'))
    }

    try {
        let response
        if (Number(req.params.code) === 0)
            response = await usersRepository.updateRecoveryCode(req.params.id as UUID, undefined)
        else
            response = await usersRepository.updateRecoveryCode(req.params.id as UUID, Number(req.params.code))
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(error(), apiLog(err))
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /users/update-password:
 *  patch:
 *      security:
 *      - BearerAuth: []
 *      description: Update password
 *      operationId: updatePassword
 *      tags:
 *      - Users
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdatePassword'
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: BAD REQUEST
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Exception'
 *          401:
 *              description: UNAUTHORIZED
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
usersControllerRouter.get('/users/update-password', json(),
    body('id').trim().notEmpty(),
    body('password').trim().notEmpty(),
    async (req, res) => {
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
            console.log(error(), apiLog('Api', '\t', 'New user request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const updatePassword = req.body as UpdatePassword
        const passwordEncrypted = hashSync(updatePassword.password, 10)

        try {
            await usersRepository.findById(updatePassword.id)
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(404).send(err ?? new Exception(404, err.message ?? 'Not found exception'))
        }

        try {
            const response = await usersRepository.updatePassword(updatePassword.id, passwordEncrypted)
            return res.status(200).send(response)
        } catch (err: any) {
            console.log(error(), apiLog(err))
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

export default usersControllerRouter