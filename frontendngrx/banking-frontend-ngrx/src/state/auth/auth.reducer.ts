import { createReducer,on } from "@ngrx/store";

import { initialAuthState } from "./auth.state";

import * as AuthActions from './auth.action'


export const authReducer=createReducer(
    initialAuthState,

    on(AuthActions.login,state=>({...state,loading:true,error:null})),

    on(AuthActions.loginSuccess,(state,{user,token})=>({
        ...state,
        user,
        token,
        loading:false
    })),
    on(AuthActions.loginfaliure,(state,{error})=>({
        ...state,
        error,
        loading:false

    })),
    on(AuthActions.signup,state=>({...state,loading:true,error:null})),
    on(AuthActions.signupSuccess,(state,{user,token})=>({
        ...state,
        user,
        token,
        loading:false
    })),
     on(AuthActions.signupfaliure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
    
)

