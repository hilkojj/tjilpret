import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ThemeService } from './services/theme.service';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ChooseRecentUserComponent } from './pages/choose-recent-user/choose-recent-user.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ChatComponent } from './pages/chat/chat.component';
import { FullLogoComponent } from './components/full-logo/full-logo.component';
import { ModalComponent } from './components/modal/modal.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ProfilePicComponent } from './components/profile-pic/profile-pic.component';
import { UsernameComponent } from './components/username/username.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { EditBioModalComponent } from './components/edit-bio-modal/edit-bio-modal.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    ChooseRecentUserComponent,
    RegisterComponent,
    NavbarComponent,
    TabsComponent,
    ChatComponent,
    FullLogoComponent,
    ModalComponent,
    SideNavComponent,
    ProfilePicComponent,
    UsernameComponent,
    EditProfileModalComponent,
    EditBioModalComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterializeModule,
    InlineSVGModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (themeService: ThemeService) => () => themeService.load(),
      deps: [ThemeService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
