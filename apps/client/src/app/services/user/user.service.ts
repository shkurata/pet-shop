import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUserPayload, UserInterface as User } from '@pet-shop/data';
import { AuthService } from '../auth/auth.service';
import { ApolloError } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private apollo: Apollo, private authService: AuthService) {}

  getLoggedInUser() {
    this.apollo
      .query<LoggedInUserPayload>({
        query: gql`
          query {
            me {
              id
              username
              pets {
                name
              }
            }
          }
        `,
      })
      .subscribe({
        next: ({ data }) => {
          if (data?.me) {
            this.userSubject.next(data.me);
          }
        },
        error: (error: ApolloError) => this.errorHandler(error),
      });
  }

  private errorHandler(error: ApolloError) {
    this.authService.logout();
  }
}
