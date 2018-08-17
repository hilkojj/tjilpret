import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
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
import { EditFavColorModalComponent } from './components/edit-fav-color-modal/edit-fav-color-modal.component';
import { ColorSliderComponent } from './components/color-slider/color-slider.component';
import { ImageCropperModalComponent } from './components/image-cropper-modal/image-cropper-modal.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { PeopleComponent } from './pages/people/people.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileFirstTabComponent } from './pages/profile/profile-first-tab/profile-first-tab.component';
import { ProfileFriendsComponent } from './pages/profile/profile-friends/profile-friends.component';
import { ProfileUploadsComponent } from './pages/profile/profile-uploads/profile-uploads.component';
import { ProfileEmoticonsComponent } from './pages/profile/profile-emoticons/profile-emoticons.component';
import { FriendButtonComponent } from './components/friend-button/friend-button.component';
import { CommentsComponent } from './components/comments/comments.component';
import { VotesComponent } from './components/votes/votes.component';
import { GiphySearchComponent } from './components/giphy-search/giphy-search.component';
import { CircularPreloaderComponent } from './components/circular-preloader/circular-preloader.component';
import { InViewportDirective } from './directives/in-viewport.directive';
import { GifPlayerComponent } from './components/gif-player/gif-player.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { SearchComponent } from './components/search/search.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { TimePipe } from './pipes/time.pipe';
import { PostComponent } from './pages/post/post.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProfileLinkDirective } from './directives/profile-link.directive';
import { PostLinkDirective } from './directives/post-link.directive';
import { EmoticonUploadComponent } from './components/emoticon-upload/emoticon-upload.component';
import { EmoticonsPipe } from './pipes/emoticons.pipe';
import { LinksPipe } from './pipes/links.pipe';
import { EscapePipe } from './pipes/escape.pipe';
import { EmoticonPickerComponent } from './components/emoticon-picker/emoticon-picker.component';
import { PostsComponent } from './pages/posts/posts.component';

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
    ToolbarComponent,
    EditFavColorModalComponent,
    ColorSliderComponent,
    ImageCropperModalComponent,
    SettingsComponent,
    TimestampPipe,
    PeopleComponent,
    ProfileComponent,
    ProfileFirstTabComponent,
    ProfileFriendsComponent,
    ProfileUploadsComponent,
    ProfileEmoticonsComponent,
    FriendButtonComponent,
    CommentsComponent,
    VotesComponent,
    GiphySearchComponent,
    CircularPreloaderComponent,
    InViewportDirective,
    GifPlayerComponent,
    NotificationsComponent,
    ProfileCardComponent,
    SearchComponent,
    PostCardComponent,
    TimePipe,
    PostComponent,
    UserListComponent,
    ProfileLinkDirective,
    PostLinkDirective,
    EmoticonUploadComponent,
    EmoticonsPipe,
    LinksPipe,
    EscapePipe,
    EmoticonPickerComponent,
    PostsComponent
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
