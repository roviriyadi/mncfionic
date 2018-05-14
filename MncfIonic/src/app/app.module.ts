import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicStorageModule } from '@ionic/storage';
import { ElasticHeader } from '../components/parallax/elastic-header';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentViewer } from '@ionic-native/document-viewer';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { GuidePage } from '../pages/guide/guide';
import { HelpPage } from '../pages/help/help';
import { ContactPage } from '../pages/contact/contact';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { VerifikasiPage } from '../pages/verifikasi/verifikasi';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ApprovalPage } from '../pages/approval/approval';

import { DbService } from '../storage/db-service';
import { BaseRestService } from '../rest-service/base-rest-service';
import { UserRest } from '../rest-service/user-rest';
import { PromotionRest } from '../rest-service/promotion-rest';
import { NotificationListPage } from '../pages/notification-list/notification-list';
import { ChatBubble } from '../components/chatbubble/chatbubble';
import { PressDirective } from '../components/longpress/longpress';
import { NotifikasiRest } from '../rest-service/notifikasi-rest';
import { PopListPage } from '../components/pop-list/pop-list';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { ScreenOrientation } from '@ionic-native/screen-orientation/index';
import { HideHeaderDirective } from '../components/parallax/hide-header';
import { NotificationDetailPage } from '../pages/notification-detail/notification-detail';
import { BadgeComponent } from '../components/badge/badge';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhotoViewer } from 'ionic-native';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DirectivesModule } from '../directives/directives.module';
import { ApprovalGroupRest } from '../rest-service/approval-group-rest';
import { ApprovalStatusRest } from '../rest-service/approval-status-rest';
import { ApprovalDetailPage } from '../pages/approval-detail/approval-detail';
import { ApprovalInfoRest } from '../rest-service/approval-info-rest';
import { ApprovalRequestRest } from '../rest-service/approval-request-rest';
import { ApprovalInfoGroupRest } from '../rest-service/approval-info-group-rest';
import { ApprovalResultPage } from '../pages/approval-result/approval-result';
import { ApprovalResultHistoryPage } from '../pages/approval-result-history/approval-result-history';
import { SecurityValidatePage } from '../pages/security-validate/security-validate';
import { PromotionDetailPage } from '../pages/promotion-detail/promotion-detail';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ApprovalProgressRest } from '../rest-service/approval-progress-rest';
import { ExtUrlRest } from '../rest-service/ext-url-rest';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ApplChecklistRest } from '../rest-service/appl-cheklist-rest';
import { BackgroundMode } from '@ionic-native/background-mode';
import { PipesModule } from '../pipes/pipes.module';
import { CekKoneksiRest } from '../rest-service/cek-koneksi-rest';
import { AdminSettingPage } from '../pages/admin-setting/admin-setting';

@NgModule({
  declarations: [
    BadgeComponent,
    PopListPage,
    MyApp,
    AboutPage,
    GuidePage,
    HelpPage,
    ContactPage,
    ElasticHeader,
    HideHeaderDirective,
    PressDirective,
    HomePage,
    ChatBubble,
    NotificationListPage,
    NotificationDetailPage,
    LoginPage,
    RegisterPage,
    VerifikasiPage,
    UserProfilePage,
    ApprovalPage,
    ApprovalDetailPage,
    ApprovalResultPage,
    ApprovalResultHistoryPage,
    SecurityValidatePage,
    PromotionDetailPage,
    DashboardPage,
    AdminSettingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    DirectivesModule,
    PipesModule,
    IonicModule.forRoot(MyApp,{
      mode:"md",
      //backButtonText:"Go Back",
      backButtonIcon: "ios-arrow-back",
      iconMode:"ios",
      modalEnter:"modal-slide-in",
      modalLeave:"modal-slide-out",
      tabsPlacement:"bottom",
      pageTransition:"ios-transition"
    }),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule
    /*AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4-GoZzOqYTvxMe52YQZch5JaCFN6ACLg'
    })*/
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PopListPage,
    MyApp,
    HomePage,
    AboutPage,
    GuidePage,
    HelpPage,
    ContactPage,
    ChatBubble,
    NotificationListPage,
    NotificationDetailPage,
    LoginPage,
    RegisterPage,
    VerifikasiPage,
    UserProfilePage,
    ApprovalPage,
    ApprovalDetailPage,
    ApprovalResultPage,
    ApprovalResultHistoryPage,
    SecurityValidatePage,
    PromotionDetailPage,
    DashboardPage,
    AdminSettingPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ElasticHeader,
    PressDirective,
  ],
  providers: [
    SplashScreen,
    StreamingMedia,
    ScreenOrientation,
    DbService,
    BaseRestService,
    CekKoneksiRest,
    NotifikasiRest,
    PromotionRest,
    UserRest,
    ApprovalGroupRest,
    ApprovalStatusRest,
    ApprovalInfoGroupRest,
    ApprovalInfoRest,
    ApprovalRequestRest,
    ApprovalProgressRest,
    ApplChecklistRest,
    ExtUrlRest,
    PhotoViewer,
    FileTransfer,
    FileOpener,
    File,
    FileChooser,
    DocumentViewer,
    LocalNotifications,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}