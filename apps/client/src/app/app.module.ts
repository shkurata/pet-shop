import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';

const routes: Route[] = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'login',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
