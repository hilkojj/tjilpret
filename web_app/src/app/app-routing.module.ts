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
import { PeopleComponent } from './pages/people/people.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileFriendsComponent } from './pages/profile/profile-friends/profile-friends.component';
import { ProfileFirstTabComponent } from './pages/profile/profile-first-tab/profile-first-tab.component';
import { ProfileUploadsComponent } from './pages/profile/profile-uploads/profile-uploads.component';
import { ProfileEmoticonsComponent } from './pages/profile/profile-emoticons/profile-emoticons.component';
import { UserResolver } from './resolvers/user-resolver';
import { ColorClassResolver } from './pages/profile/profile-first-tab/color-class-resolver';
import { PostComponent } from './pages/post/post.component';
import { PostResolver } from './resolvers/post-resolver';
import { PostsComponent } from './pages/posts/posts.component';

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
        path: "dollepret/:tab", component: PostsComponent,
        canActivate: [AuthService], data: {
            title: "Dolle pret",
            favColorTheme: true,
            showNavbar: true
        }
    },
    {
        path: "dollepret", redirectTo: "dollepret/"
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
        resolve: {
            user: UserResolver
        },
        children: [
            {
                path: '', component: ProfileFirstTabComponent, resolve: {
                    colorClass: ColorClassResolver
                }, data: { showNavbar: true }
            },
            { path: 'vriends', component: ProfileFriendsComponent, data: { showNavbar: true } },
            { path: 'uploods', component: ProfileUploadsComponent, data: { showNavbar: true } },
            { path: 'emotikons', component: ProfileEmoticonsComponent, data: { showNavbar: true } },
        ]
    },
    {
        path: "uplood/:id", component: PostComponent,
        canActivate: [AuthService], data: {
            showNavbar: true,
            dontReuse: ["id"],
            favColorTheme: true
        },
        resolve: {
            post: PostResolver
        }
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
    exports: [RouterModule],
    providers: [
        PostResolver,
        UserResolver,
        ColorClassResolver
    ]
})
export class AppRoutingModule { }
