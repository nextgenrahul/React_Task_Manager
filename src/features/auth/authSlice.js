import { createSlice } from "@reduxjs/toolkit";

const loadAuthState = () => {
    const authState = localStorage.getItem("authState");
    return authState ? JSON.parse(authState) : { user: null, token: null, isAuthenticated: false };
}

const initialState = loadAuthState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signUp: (state, action) => {
            const { email, password } = action.payload;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({ email, password });
            localStorage.setItem('users', JSON.stringify(users));
            state.user = { email };
            state.token = Date.now().toString(); // Simple token for demo
            state.isAuthenticated = true;
            localStorage.setItem('authState', JSON.stringify(state));
            sessionStorage.setItem('authToken', state.token);
        },
        logIn: (state, action) => {
            const { email, password } = action.payload;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u) => u.email === email && u.password === password);
            if (user) {
                state.user = { email };
                state.token = Date.now().toString();
                state.isAuthenticated = true;
                localStorage.setItem('authState', JSON.stringify(state));
                sessionStorage.setItem('authToken', state.token);
            } else {
                throw new Error('Invalid credentials');
            }
        },
        logOut: (state, action) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authState');
            sessionStorage.removeItem('authToken');
        }
    }
});

export const { signUp, logIn, logOut, setThemeMode } = authSlice.actions;
export default authSlice.reducer;