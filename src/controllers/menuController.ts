import { json } from "body-parser"
import { randomUUID, UUID } from "crypto"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { apiLog, error, info } from "../constants/constants"
import { MenuDTO } from "../model/DTO/menuDTO"
import { Exception } from "../model/exception"
import { Menu } from "../model/menu"
import { menusRepository } from "../repository/menus/menusRepository"

const menusControllerRouter = Router()

/**
 * @openapi
 * /menus:
 *  post:
 *      description: Create new menu
 *      operationId: saveMenu
 *      tags:
 *      - Menus
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/MenuDTO'
 *      responses:
 *          201:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Menu'
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
menusControllerRouter.post('/menus', json(),
    body('price').trim().notEmpty().isNumeric(),
    body('score').trim().notEmpty().isNumeric(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'New menu request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New menu request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const menuDTO = req.body as MenuDTO

        const menu = new Menu(
            randomUUID(),
            new Date().getTime(),
            null,
            menuDTO.price,
            menuDTO.score
        )

        try {
            await menusRepository.save(menu)
            return res.status(201).send(menu)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

/**
 * @openapi
 * /menus:
 *  put:
 *      description: Update menu
 *      operationId: updateMenu
 *      tags:
 *      - Menus
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Menu'
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
menusControllerRouter.put('/menus', json(),
    body('id').trim().notEmpty(),
    body('date').trim().notEmpty().isNumeric(),
    body('price').trim().notEmpty().isNumeric(),
    body('score').trim().notEmpty().isNumeric(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'Update menu request:'))
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
            console.log(error(), apiLog('Api', '\t', 'New menu request', 'validation error:'))
            console.log('\t\t', apiLog(JSON.stringify(exception)))

            return res.status(400).send(exception)
        }

        const menu = req.body as Menu

        try {
            await menusRepository.findById(menu.id)
        } catch (err: any) {
            return res.status(404).send(err.message ?? 'Not found exception')
        }

        try {
            const response = await menusRepository.update(menu)
            return res.status(200).send(response)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

/**
 * @openapi
 * /menus:
 *  delete:
 *      description: Delete all menus
 *      operationId: deleteAllMenu
 *      tags:
 *      - Menus
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
menusControllerRouter.delete('/menus', json(), async (req, res) => {
    try {
        const response = await menusRepository.deleteAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /menus/id/{id}:
 *  get:
 *      description: Get menu by id
 *      operationId: getMenuById
 *      tags:
 *      - Menus
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
 *                          $ref: '#/components/schemas/Menu'
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
menusControllerRouter.get('/menus/id/:id', json(), async (req, res) => {
    try {
        const response = await menusRepository.findById(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(err)
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /menus:
 *  get:
 *      description: Get all menus
 *      operationId: getAllMenu
 *      tags:
 *      - Menus
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Menu'
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
menusControllerRouter.get('/menus', json(), async (req, res) => {
    try {
        const response = await menusRepository.findAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

export default menusControllerRouter