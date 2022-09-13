import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos for userId:', userId)

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Create todo', todo)
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodo(todo: TodoUpdate, todoId: string): Promise<void> {
        logger.info('Update todo', todo)
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "id": todoId
            },
            UpdateExpression: "set name = :a, dueDate = :b, done = :c",
            ExpressionAttributeValues: {
                ":a": todo.name,
                ":b": todo.dueDate,
                ":c": todo.done
            }
        }).promise()
    }

    async deleteTodo(todoId: string): Promise<void> {
        logger.info('Delete todo', todoId)
        await this.docClient.delete({
            Key: {
                'id': todoId
            },
            TableName: this.todoTable
        }).promise()
    }
}

