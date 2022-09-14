import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {getUserId} from "../utils";

import {createAttachmentPresignedUrl} from '../../fileStored/attachmentUtils'
import {createLogger} from "../../utils/logger";
const logger = createLogger('attachmentHandler')


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)
        logger.info('Process to create presignedUrl and update todo')
        const presignedUrl = await createAttachmentPresignedUrl(todoId, userId)

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: `{ "uploadUrl": "${presignedUrl}" }`
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
