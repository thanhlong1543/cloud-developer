import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate';
const logger = createLogger('TodosAccess')

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
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

        logger.info('Data query:', result.Items)

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Create todo', todo)
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()
        logger.info('Update todo success:', todo)

        return todo
    }

    async updateTodo(todo: TodoUpdate, todoId: string, userId: string): Promise<void> {
        logger.info('Update todo', todo)
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                'userId': userId
            },
            UpdateExpression: "set dueDate = :b, done = :c",
            ExpressionAttributeValues: {
                ":b": todo.dueDate,
                ":c": todo.done
            }
        }).promise()
        logger.info('Update todo success:', todoId)
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        logger.info('Delete todo', todoId)
        await this.docClient.delete({
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            TableName: this.todoTable
        }).promise()
        logger.info('Delete todo success:', todoId)
    }

    async updateAttachmentURL(todoId: String, userId: String, url: String): Promise<void> {
        logger.info(`updating attachmentURL for ${todoId}. Setting URL to ${url}`)
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl=:url",
            ExpressionAttributeValues: {
                ":url": url
            }
        }).promise()
        logger.info("update attachment successfully:", todoId)
    }
}

