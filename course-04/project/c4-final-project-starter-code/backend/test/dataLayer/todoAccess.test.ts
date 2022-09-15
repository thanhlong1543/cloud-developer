import {TodoAccess} from '../../src/dataLayer/todosAcess'

const todo = {
    todoId: 'todo-id',
    name: 'todo-name',
    description: 'todo-description',
    userId: 'user-id'
}

const getPromise = jest.fn()

const dynamoDbClient: any = {
    query: jest.fn(() => {
        return {
            promise: getPromise
        }
    }),
}

const todoAccess = new TodoAccess(dynamoDbClient)

test('test get todo when it does exist', async () => {
    getPromise.mockResolvedValue({
        Items: todo
    })

    const result = await todoAccess.getTodosForUser(todo.userId)

    expect(result).toEqual(todo)
})

test('test get todo when it does not exist', async () => {
    getPromise.mockResolvedValue({
        Items: null
    })

    const result = await todoAccess.getTodosForUser(todo.userId)

    expect(result).toEqual(null)
})
