import express from "express"
import { createServer } from "http"
import swaggerJsdoc from "swagger-jsdoc"
import { serve, setup } from "swagger-ui-express"
import { RESTAPI_DOMAIN, RESTAPI_HOST, RESTAPI_PORT, RESTAPI_PROTOCOL } from "../config/environments"
import { apiLog, info } from "../constants/constants"
import { routerClient } from "../router/router"
import { apiUrl } from "../utils/utils"

/**
 * This client creates the api environment we need to make requests to WinCC OA projects.
 * It also creates the swagger documentation base on the endpoints and the data provided.
 * @param configuration - The configuration provided in the config folder
 */
export const apiClient = () => {
    const app = express()
    const apis = []
    apis.push('./src/controllers/*Controller.ts')
    apis.push('./src/model/*.ts')
    apis.push('./src/model/DTO/*.ts')
    apis.push('./src/model/utils/*.ts')
    const url = apiUrl(RESTAPI_PROTOCOL, RESTAPI_HOST, RESTAPI_PORT, RESTAPI_DOMAIN)
    const port = RESTAPI_PORT

    const options = {
        failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
        definition: {
            openapi: '3.0.2',
            info: {
                title: 'GATEWAY SERVICE',
                version: '1.0.0',
                contact: {
                    name: 'Irene Cunto',
                    email: 'ire.cunba@gmail.com'
                },
                license: {
                    name: 'MIT License',
                }
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            servers: [
                {
                    url: url
                }
            ],
        },
        apis: apis
    };

    const swaggerSpec = swaggerJsdoc(options);
    app.use('/swagger', serve, setup(swaggerSpec))
    app.use('/swagger-json', (req, res) => res.send(JSON.stringify(swaggerSpec)))

    const router = routerClient()
    app.use(router!)

    // const certPath = getDirname() + '\\cert\\' + REST_API_CERT_PATH

    // createServer({
    //     cert: readFileSync(certPath + REST_API_CERT_CRT),
    //     key: readFileSync(certPath + REST_API_CERT_KEY),
    //     ca: readFileSync(certPath + REST_API_CERT_CA),
    //     requestCert: true,
    //     rejectUnauthorized: true
    // }, app).listen(port, () => console.log(info(), apiLog('Api', '\t', 'running in port', port)))

    createServer(app).listen(port, () => console.log(info(), apiLog('Api', '\t', 'running in port', port)))

}