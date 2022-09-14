import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {getUserId} from '../utils';
import {createTodo} from '../../businessLogic/todos'
import {createLogger} from "../../utils/logger";

const logger = createLogger('TodoHandler')


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        logger.info('Incoming request for create Todo:', event)
        const newTodo: CreateTodoRequest = JSON.parse(event.body)
        // TODO: Implement creating a new TODO item
        let result = await createTodo(newTodo, getUserId(event))
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                item: result
            })
        }
    }
)

handler.use(
    cors({
        credentials: true
    })
)
