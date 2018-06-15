import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: "", redirectTo: "hoom", pathMatch: "full"
  },
  {
    path: "hoom", component: HomeComponent, canActivate: [AuthGuardService]
  },
  {
    path: "inlogge", component: LoginComponent
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

export const routingComponents = [
  HomeComponent
];