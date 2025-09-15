import { createAction,props } from "@ngrx/store";


export const login=createAction('[Auth] Login',props<{email:string;password:string}>());
export const loginSuccess=createAction('[Auth] Login Success',props<{user:any,token:string}>())
export const loginfaliure=createAction('[Auth] Login failure',props<{error:string}>())


export const signup=createAction('[Auth] Signup',props<{name:string;email:string;password:string}>());
export const signupSuccess=createAction('[Auth] Signup Success',props<{user:any,token:string}>())
export const signupfaliure=createAction('[Auth] Signup failure',props<{error:string}>())


