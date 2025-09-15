import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, from, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideApollo(() => {
        const httpLink = inject(HttpLink);
        const authLink = setContext(() => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                return {};
            }
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        });
        return {
            cache: new InMemoryCache(),
            link: from([
                authLink as unknown as ApolloLink,
                httpLink.create({
                    uri: 'http://localhost:3000/graphql',
                }) as unknown as ApolloLink,
            ]),
        };
    })
],
});
