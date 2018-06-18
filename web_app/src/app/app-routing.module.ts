import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChooseRecentUserComponent } from './pages/choose-recent-user/choose-recent-user.component';

export const enum RouterPath {
    Home = "hoom",
    Login = "inlogge",
    ChooseRecentUser = "resente-accounts"
}

const routes: Routes = [
  {
    path: "", redirectTo: RouterPath.Home, pathMatch: "full"
  },
  {
    path: RouterPath.Home, component: HomeComponent, canActivate: [AuthService]
  },
  {
    path: RouterPath.Login, component: LoginComponent
  },
  {
    path: RouterPath.ChooseRecentUser, component: ChooseRecentUserComponent
  },
  {
    path: "**", component: NotFoundComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
