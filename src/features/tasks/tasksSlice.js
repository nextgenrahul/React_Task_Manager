import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [
        {
            id: 32,
            task: "First Task Default",
            completed: false,
            priority: 'low', 
        }
    ],
}

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            state.success = true;
            state.message = "Task added successfully";
        },
        updateTask: (state, action) => {
            const { id, task } = action.payload;
            state.tasks = state.tasks.map((t) =>
                t.id === id ? { ...t, task: task } : t
            )
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        },
        toggleEvent: (state, action) => {
            state.tasks = state.tasks.map((t) => {
                if (t.id === action.payload) {
                    return { ...t, completed: !t.completed };
                }
                return t;
            });
        }

    }
})

export const { addTask, updateTask, deleteTask, toggleEvent } = taskSlice.actions;
export default taskSlice.reducer;