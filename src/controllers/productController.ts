import { json } from "body-parser"
import { randomUUID, UUID } from "crypto"
import { Router } from "express"
import { body, ValidationError, validationResult } from "express-validator"
import { apiLog, error, info } from "../constants/constants"
import { ProductDTO } from "../model/DTO/productDTO"
import { Exception } from "../model/exception"
import { Menu } from "../model/menu"
import { Product } from "../model/product"
import { Publication } from "../model/publication"
import { menusRepository } from "../repository/menus/menusRepository"
import { productsRepository } from "../repository/products/productsRepository"

const productsControllerRouter = Router()

/**
 * @openapi
 * /products:
 *  post:
 *      description: Create new product
 *      operationId: saveProduct
 *      tags:
 *      - Products
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ProductDTO'
 *      responses:
 *          201:
 *              description: CREATED
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
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
productsControllerRouter.post('/products', json(),
    body('name').trim().notEmpty(),
    body('location').trim().notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'New product request:'))
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

        const productDTO = req.body as ProductDTO

        let publication: any
        if (productDTO.publication_id) {
            try {
                publication = await publicationsRepository.findById(productDTO.publication_id)
            } catch (err: any) {
                return res.status(404).send(err.message ?? 'Publication not found exception')
            }
    
            if (!(publication instanceof Publication)) {
                return res.status(404).send('Publication not found exception')
            }
        }

        let menu: any
        if (productDTO.menu_id) {
            try {
                menu = await menusRepository.findById(productDTO.menu_id!)
            } catch (err: any) {
                return res.status(404).send(err.message ?? 'Menu not found exception')
            }

            if (!(menu instanceof Menu)) {
                return res.status(404).send('Menu not found exception')
            }
        }

        const product = new Product(
            randomUUID(),
            productDTO.name,
            new Date().getTime(),
            productDTO.in_menu,
            productDTO.price ?? 0,
            productDTO.score!,
            publication,
            menu
        )

        try {
            await productsRepository.save(product)
            return res.status(201).send(product)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }

    })

/**
 * @openapi
 * /products:
 *  put:
 *      description: Update product
 *      operationId: updateProduct
 *      tags:
 *      - Products
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
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
productsControllerRouter.put('/products', json(),
    body('id').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('score').notEmpty(),
    async (req, res) => {
        console.log(info(), apiLog('Api', '\t', 'Update product request:'))
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

        const product = req.body as Product

        try {
            await productsRepository.findById(product.id)
        } catch (err: any) {
            return res.status(404).send(err.message ?? 'Not found exception')
        }

        try {
            const response = await productsRepository.update(product)
            return res.status(200).send(response)
        } catch (err: any) {
            return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
        }
    })

/**
 * @openapi
 * /products:
 *  delete:
 *      description: Delete all products
 *      operationId: deleteAllProduct
 *      tags:
 *      - Products
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
productsControllerRouter.delete('/products', json(), async (req, res) => {
    try {
        const response = await productsRepository.deleteAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /products/id/{id}:
 *  get:
 *      description: Get product by id
 *      operationId: getProductById
 *      tags:
 *      - Products
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
 *                          $ref: '#/components/schemas/Product'
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
productsControllerRouter.get('/products/id/:id', json(), async (req, res) => {
    try {
        const response = await productsRepository.findById(req.params.id as UUID)
        return res.status(200).send(response)
    } catch (err: any) {
        console.log(err)
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

/**
 * @openapi
 * /products:
 *  get:
 *      description: Get all products
 *      operationId: getAllProduct
 *      tags:
 *      - Products
 *      responses:
 *          200:
 *              description: SUCCESS
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
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
productsControllerRouter.get('/products', json(), async (req, res) => {
    try {
        const response = await productsRepository.findAll()
        return res.status(200).send(response)
    } catch (err: any) {
        return res.status(err.code ?? 500).send(err ?? new Exception(500, 'Internal server error'))
    }
})

export default productsControllerRouter