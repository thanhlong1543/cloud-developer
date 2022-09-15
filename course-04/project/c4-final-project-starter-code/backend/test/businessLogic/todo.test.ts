import { TodoAccess } from '../../src/dataLayer/todosAcess'
import * as Todo from '../../src/businessLogic/todos'

jest.mock('../../src/dataLayer/todosAcess')

const todo = {
    todoId: 'todo-id',
    name: 'todo-name',
    userId: 'user-id'
}

const todoAccess = (TodoAccess as any).mock.instances[0]

test('get todo should return a todo from the access layer', async () => {
    await todoAccess.getTodosForUser.mockResolvedValue(todo)
    const result = await Todo.getTodosForUser(todo.userId)

    expect(result).toEqual(todo)
    expect(todoAccess.getTodosForUser).toHaveBeenCalledWith(todo.userId)
})

test('delete todo success from the access layer', async () => {
    await Todo.deleteTodo(todo.todoId,todo.userId)

    expect(todoAccess.deleteTodo).toHaveBeenCalledWith(todo.todoId,todo.userId)
})
