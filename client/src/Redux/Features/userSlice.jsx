import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: '', 
    isLogin: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUserData: (state, action) => {
            state.name = action.payload, 
            state.isLogin = true
        },
        clearUserData: (state, action) => {
            state.name = '', 
            state.isLogin = false
        }
    }
})

export const { saveUserData, clearUserData } = userSlice.actions
const userReducer = userSlice.reducer
export default userReducer