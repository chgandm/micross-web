import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AngularFireModule } from 'angularfire2';
import { SharedModule } from './shared.module';
import { CoreModule } from './core.module';
import { routes, firebaseAuthConfig } from './app.constants';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig, firebaseAuthConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
