import { json } from "body-parser"
import { randomUUID, UUID } from "crypto"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { apiLog, error, info } from "../constants/constants"
import { EstablishmentDTO } from "../model/DTO/establishmentDTO"
import { Establishment } from "../model/establishment"
import { Exception } from "../model/exception"
import { establishmentsRepository } from "../repository/establishments/establishmentsRepository"

const establishmentsControllerRouter = Router()

/**
 * @openapi
 * /establishments:
 *  post:
 *      security:
 *      - BearerAuth: []
 *      description: Create new establishment
 *      operationId: saveEstablishment
 *      tags:
 *      - Establishments
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/EstablishmentDTO'
 *      responses:
 *          201:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.post('/establishments', json(),
    body('name').trim().notEmpty(),
    body('location').trim().notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'New establishment request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New establishment request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const establishmentDTO = req.body as EstablishmentDTO

        const establishment = new Establishment(
            randomUUID(),
            establishmentDTO.name,
            new Date().getTime(),
            null,
            establishmentDTO.location,
            true,
            establishmentDTO.isComputerAllowed,
            establishmentDTO.mapsId,
            0
        )

        try {
            await establishmentsRepository.save(establishment)
            return res.status(201).send(establishment)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

/**
 * @openapi
 * /establishments:
 *  put:
 *      security:
 *      - BearerAuth: []
 *      description: Update establishment
 *      operationId: updateEstablishment
 *      tags:
 *      - Establishments
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.put('/establishments', json(),
    body('id').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('created').trim().notEmpty().isNumeric(),
    body('updated').trim().notEmpty().isNumeric(),
    body('location').trim().notEmpty(),
    body('score').notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'Update establishment request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New establishment request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const establishment = req.body as Establishment

        try {
            await establishmentsRepository.findById(establishment.id)
        } catch (err: any) {
            return res.status(404).send(err.message ?? 'Not found exception')
        }

        try {
            const response = await establishmentsRepository.update(establishment)
            return res.status(200).send(response)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

/**
 * @openapi
 * /establishments:
 *  delete:
 *      security:
 *      - BearerAuth: []
 *      description: Delete all establishments
 *      operationId: deleteAllEstablishment
 *      tags:
 *      - Establishments
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
establishmentsControllerRouter.delete('/establishments', json(), async (req, res) => {
    try {
        const response = await establishmentsRepository.deleteAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /establishments/id/{id}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get establishment by id
 *      operationId: getEstablishmentById
 *      tags:
 *      - Establishments
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
 *                          $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.get('/establishments/id/:id', json(), async (req, res) => {
    try {
        const response = await establishmentsRepository.findById(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(err)
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /establishments:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get all establishments
 *      operationId: getAllEstablishment
 *      tags:
 *      - Establishments
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.get('/establishments', json(), async (req, res) => {
    try {
        const response = await establishmentsRepository.findAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /establishments/name/{name}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get by name
 *      operationId: getEstablishmentByName
 *      tags:
 *      - Establishments
 *      parameters:
 *          - in: path
 *            name: name
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.get('/establishments/name/:name', json(), async (req, res) => {
    try {
        const response = await establishmentsRepository.findByName(req.params.name)
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /establishments/mapsId/{mapsId}:
 *  get:
 *      security:
 *      - BearerAuth: []
 *      description: Get by name
 *      operationId: getEstablishmentByMapsId
 *      tags:
 *      - Establishments
 *      parameters:
 *          - in: path
 *            name: mapsId
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Establishment'
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
establishmentsControllerRouter.get('/establishments/mapsId/:mapsId', json(), async (req, res) => {
    try {
        const response = await establishmentsRepository.findByMapsId(req.params.mapsId)
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

export default establishmentsControllerRouter