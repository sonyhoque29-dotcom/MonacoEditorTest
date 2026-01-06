export interface Todo {
    id: number
    title: string
    description: string
    completed: boolean
    important: boolean
    urgent: boolean
    archived: boolean
}

// Fake API data
const todos: Todo[] = [
    {
        id: 1,
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature',
        completed: false,
        important: true,
        urgent: true,
        archived: false,
    },
    {
        id: 2,
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        completed: true,
        important: true,
        urgent: false,
        archived: false,
    },
    {
        id: 3,
        title: 'Update dependencies',
        description: 'Update all npm packages to latest versions',
        completed: false,
        important: false,
        urgent: false,
        archived: false,
    },
    {
        id: 4,
        title: 'Fix bug in authentication',
        description: 'Resolve the login issue reported by users',
        completed: false,
        important: true,
        urgent: true,
        archived: false,
    },
    {
        id: 5,
        title: 'Prepare presentation',
        description: 'Create slides for the team meeting',
        completed: true,
        important: false,
        urgent: false,
        archived: true,
    },
    {
        id: 6,
        title: 'Refactor legacy code',
        description: 'Clean up and modernize old codebase',
        completed: false,
        important: false,
        urgent: false,
        archived: false,
    },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fake API functions
export const todoApi = {
    // Get all todos
    getTodos: async (): Promise<Todo[]> => {
        await delay(500)
        return [...todos]
    },

    // Get todo by id
    getTodoById: async (id: number): Promise<Todo | undefined> => {
        await delay(300)
        return todos.find((todo) => todo.id === id)
    },

    // Toggle completed status
    toggleCompleted: async (id: number): Promise<Todo | undefined> => {
        await delay(200)
        const todo = todos.find((t) => t.id === id)
        if (todo) {
            todo.completed = !todo.completed
        }
        return todo
    },

    // Toggle important status
    toggleImportant: async (id: number): Promise<Todo | undefined> => {
        await delay(200)
        const todo = todos.find((t) => t.id === id)
        if (todo) {
            todo.important = !todo.important
        }
        return todo
    },

    // Toggle urgent status
    toggleUrgent: async (id: number): Promise<Todo | undefined> => {
        await delay(200)
        const todo = todos.find((t) => t.id === id)
        if (todo) {
            todo.urgent = !todo.urgent
        }
        return todo
    },

    // Toggle archived status
    toggleArchived: async (id: number): Promise<Todo | undefined> => {
        await delay(200)
        const todo = todos.find((t) => t.id === id)
        if (todo) {
            todo.archived = !todo.archived
        }
        return todo
    },

    // Add new todo
    addTodo: async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
        await delay(300)
        const newTodo: Todo = {
            ...todo,
            id: Math.max(...todos.map((t) => t.id)) + 1,
        }
        todos.push(newTodo)
        return newTodo
    },

    // Delete todo
    deleteTodo: async (id: number): Promise<boolean> => {
        await delay(300)
        const index = todos.findIndex((t) => t.id === id)
        if (index !== -1) {
            todos.splice(index, 1)
            return true
        }
        return false
    },
}
