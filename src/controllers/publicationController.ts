import { json } from "body-parser"
import { randomUUID, UUID } from "crypto"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { apiLog, error, info } from "../constants/constants"
import { PublicationDTO } from "../model/DTO/publicationDTO"
import { Establishment } from "../model/establishment"
import { Exception } from "../model/exception"
import { Menu } from "../model/menu"
import { Publication } from "../model/publication"
import { establishmentsRepository } from "../repository/establishments/establishmentsRepository"
import { publicationsRepository } from "../repository/publications/publicationsRepository"
import { usersRepository } from "../repository/users/usersRepository"

const publicationsControllerRouter = Router()

/**
 * @openapi
 * /publications:
 *  post:
 *      security:
 *      - BearerAuth: []
 *      description: Create new publication
 *      operationId: savePublication
 *      tags:
 *      - Publications
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PublicationDTO'
 *      responses:
 *          201:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.post('/publications', json(),
    body('totalPrice').trim().notEmpty(),
    body('totalScore').trim().notEmpty(),
    body('photo').trim().notEmpty(),
    body('establishmentId').trim().notEmpty(),
    body('userId').trim().notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'New publication request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New publication request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const publicationDTO = req.body as PublicationDTO

        let establishment: any
        if (publicationDTO.establishmentId) {
            try {
                establishment = await establishmentsRepository.findById(publicationDTO.establishmentId)
            } catch (err: any) {
                return res.status(404).send(err.message ?? 'Publication not found exception')
            }

            if (!(establishment instanceof Establishment)) {
                return res.status(404).send('Publication not found exception')
            }
        }

        let user: any
        if (publicationDTO.userId) {
            try {
                user = await usersRepository.findById(publicationDTO.userId!)
            } catch (err: any) {
                return res.status(404).send(err.message ?? 'Menu not found exception')
            }

            if (!(user instanceof Menu)) {
                return res.status(404).send('Menu not found exception')
            }
        }

        const publication = new Publication(
            randomUUID(),
            new Date().getTime(),
            null,
            publicationDTO.totalPrice,
            publicationDTO.totalScore,
            publicationDTO.photo,
            publicationDTO.comment,
            establishment,
            user
        )

        try {
            await publicationsRepository.save(publication)
            return res.status(201).send(publication)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

/**
 * @openapi
 * /publications:
 *  put:
 *      security:
 *      - BearerAuth: []
 *      description: Update publication
 *      operationId: updatePublication
 *      tags:
 *      - Publications
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.put('/publications', json(),
    body('totalPrice').trim().notEmpty(),
    body('totalScore').trim().notEmpty(),
    body('photo').trim().notEmpty(),
    body('establishmentId').trim().notEmpty(),
    body('userId').trim().notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'Update publication request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New publication request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const publication = req.body as Publication

        try {
            await publicationsRepository.findById(publication.id)
        } catch (err: any) {
            return res.status(404).send(err.message ?? 'Not found exception')
        }

        try {
            const response = await publicationsRepository.update(publication)
            return res.status(200).send(response)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

/**
 * @openapi
 * /publications:
 *  delete:
 *      security:
 *      - BearerAuth: []
 *      description: Delete all publications
 *      operationId: deleteAllPublication
 *      tags:
 *      - Publications
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
publicationsControllerRouter.delete('/publications', json(), async (req, res) => {
    try {
        const response = await publicationsRepository.deleteAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /publications/id/{id}:
 *  get:
 *      description: Get publication by id
 *      operationId: getPublicationById
 *      tags:
 *      - Publications
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
 *                          $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.get('/publications/id/:id', json(), async (req, res) => {
    try {
        const response = await publicationsRepository.findById(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(err)
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /publications:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get all publications
 *      operationId: getAllPublication
 *      tags:
 *      - Publications
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.get('/publications', json(), async (req, res) => {
    try {
        const response = await publicationsRepository.findAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /publications/establishment/{id}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get publications by establishment ID
 *      operationId: getPublicationsByEstablishmentId
 *      tags:
 *      - Publications
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
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.get('/publications/establishment/:id', json(), async (req, res) => {
    try {
        const response = await publicationsRepository.findByEstablishment(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /publications/user/{id}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get publications by user ID
 *      operationId: getPublicationsByUserId
 *      tags:
 *      - Publications
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
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Publication'
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
publicationsControllerRouter.get('/publications/user/:id', json(), async (req, res) => {
    try {
        const response = await publicationsRepository.findByUser(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

export default publicationsControllerRouter