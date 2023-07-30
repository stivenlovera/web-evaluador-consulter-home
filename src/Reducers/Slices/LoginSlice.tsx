import { createSlice } from '@reduxjs/toolkit';
import { InitialState, LoginState } from './ILoginSlice';

function verificarToken() {
    if (localStorage.getItem('token')!=null) {
        return true;
    }
    else{
        return false;
    }
}
const initialState: InitialState = {
    token: verificarToken()
}
export const TokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            //minilogica
            if (action.payload.token != "") {
                localStorage.setItem('token', action.payload.token);
            }
            else {
                localStorage.removeItem('token');
            }
            state.token = action.payload.token;
        }
    }
})

export const { setToken } = TokenSlice.actions;
export const SelectToken = (state: LoginState) => {
    return state.token
};
export default TokenSlice.reducer;