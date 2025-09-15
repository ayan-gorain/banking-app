import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.action';

export const authReducer = createReducer(
  initialAuthState,
  
  // Login Actions
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    isAuthenticated: true
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Signup Actions
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.signupSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
    isAuthenticated: true
  })),
  
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Logout Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
  })),
  
  // Load User Actions
  on(AuthActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loadUserSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    isAuthenticated: true
  })),
  
  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Clear Error Action
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
