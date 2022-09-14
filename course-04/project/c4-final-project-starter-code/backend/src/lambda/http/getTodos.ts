import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'

import {getTodosForUser as getTodosForUser} from '../../businessLogic/todos'
import {getUserId} from '../utils';
import {TodoItem} from "../../models/TodoItem";

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // Write your code here

        const result: TodoItem[] = await getTodosForUser(getUserId(event))
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                items: result
            })
        }
    })

handler.use(
    cors({
        credentials: true
    })
)
