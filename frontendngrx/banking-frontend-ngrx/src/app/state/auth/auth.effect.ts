import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.action';

@Injectable()
export class AuthEffects {
  login$;
  signup$;
  logout$;
  loadUser$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store
  ) {
    // Login Effect
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ email, password }) =>
          this.authService.login(email, password).pipe(
            map((response) => {
              const user = response.user;
              const token = response.token;
              this.authService.setToken(token);
              this.authService.setUser(user);
              alert(`Welcome back, ${user.name}! Login successful.`);
              return AuthActions.loginSuccess({ user, token });
            }),
            catchError((error) => {
              console.error('Login Error:', error);
              return of(AuthActions.loginFailure({ error: error.message || 'Login failed' }));
            })
          )
        )
      )
    );

    // Signup Effect
    this.signup$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.signup),
        switchMap(({ input }) =>
          this.authService.signup(input).pipe(
            map((user) => {
              alert(`Welcome ${user.name}! Account created successfully.`);
              return AuthActions.signupSuccess({ user });
            }),
            catchError((error) => {
              console.error('Signup Error:', error);
              return of(AuthActions.signupFailure({ error: error.message || 'Signup failed' }));
            })
          )
        )
      )
    );

    // Logout Effect
    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
        }),
        map(() => AuthActions.logoutSuccess())
      )
    );

    // Load User Effect
    this.loadUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loadUser),
        switchMap(() => {
          const token = this.authService.getToken();
          const user = this.authService.getUser();
          
          if (token && user) {
            return of(AuthActions.loadUserSuccess({ user, token }));
          } else {
            return of(AuthActions.loadUserFailure({ error: 'No stored authentication data' }));
          }
        })
      )
    );
  }
}
