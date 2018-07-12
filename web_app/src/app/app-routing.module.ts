import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChooseRecentUserComponent } from './pages/choose-recent-user/choose-recent-user.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChatComponent } from './pages/chat/chat.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UploadsComponent } from './pages/uploads/uploads.component';
import { PeopleComponent } from './pages/people/people.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileFriendsComponent } from './pages/profile/profile-friends/profile-friends.component';
import { ProfileFirstTabComponent } from './pages/profile/profile-first-tab/profile-first-tab.component';
import { ProfileUploadsComponent } from './pages/profile/profile-uploads/profile-uploads.component';
import { ProfileGroupsComponent } from './pages/profile/profile-groups/profile-groups.component';

export const enum RouterPath {
    Home = "hoom",
    Login = "inlogge",
    ChooseRecentUser = "resente-accounts",
    Register = "wordt-lid-van-deze-super-koele-site"
}

const routes: Routes = [
    {
        path: "", redirectTo: RouterPath.Home, pathMatch: "full"
    },
    {
        path: RouterPath.Home, component: HomeComponent,
        canActivate: [AuthService], data: {
            title: "Hoom",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: "tjets", component: ChatComponent,
        canActivate: [AuthService], data: {
            title: "Tjets",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: "amusement", component: UploadsComponent,
        canActivate: [AuthService], data: {
            title: "Genieten van topcontent",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: "tjillers", component: PeopleComponent,
        canActivate: [AuthService], data: {
            title: "Mesnen & vriends",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: "tjiller/:id", component: ProfileComponent,
        canActivate: [AuthService], data: {
            showNavbar: true,
            dontReuse: ["id"]
        },
        children: [
            { path: '', component: ProfileFirstTabComponent, data: { showNavbar: true } },
            { path: 'vriends', component: ProfileFriendsComponent, data: { showNavbar: true } },
            { path: 'uploods', component: ProfileUploadsComponent, data: { showNavbar: true } },
            { path: 'groeps', component: ProfileGroupsComponent, data: { showNavbar: true } },
        ]
    },
    {
        path: "instellingun", component: SettingsComponent,
        canActivate: [AuthService], data: {
            title: "Instellingun",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: RouterPath.Login, component: LoginComponent,
        canActivate: [AuthService], data: {
            disallowAuth: true,
            title: "Inlogge bij tjilpret",
            showLogo: true,
            defaultTheme: true
        }
    },
    {
        path: RouterPath.ChooseRecentUser, component: ChooseRecentUserComponent,
        canActivate: [AuthService], data: {
            disallowAuth: true,
            title: "Recente accounts",
            showLogo: true,
            defaultTheme: true
        }
    },
    {
        path: RouterPath.Register, component: RegisterComponent,
        canActivate: [AuthService], data: {
            disallowAuth: true,
            title: "Wordt een tjiller",
            showLogo: true,
            defaultTheme: true
        }
    },
    {
        path: "**", component: NotFoundComponent, data: {
            title: "o nee o nee o nee o nee o nee",
            defaultTheme: true
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
