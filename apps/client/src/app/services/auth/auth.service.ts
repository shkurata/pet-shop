import { Injectable } from '@angular/core';
import { LoginResultPayload } from '@pet-shop/data';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import ms, { StringValue } from 'ms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apollo: Apollo) {
    if (localStorage.getItem('token')) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  login(username: string, password: string): void {
    this.apollo
      .mutate<LoginResultPayload>({
        mutation: gql`
          mutation login($loginUserInput: LoginUserInput!) {
            login(loginUserInput: $loginUserInput) {
              access_token
              expires_in
            }
          }
        `,
        variables: {
          loginUserInput: {
            username,
            password,
          },
        },
      })
      .subscribe({
        next: ({ data }) => {
          if (data?.login?.access_token) {
            this.createSession(data.login.access_token, data.login.expires_in);
          }
        },
        error: console.log,
      });
  }

  private createSession(access_token: string, expires_in: StringValue) {
    localStorage.setItem('token', access_token);
    localStorage.setItem(
      'expires_at',
      JSON.stringify(ms(expires_in) + new Date().getTime())
    );
    this.isAuthenticatedSubject.next(true);
    window.location.href = '/';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    this.isAuthenticatedSubject.next(false);
  }
}
