import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './content/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppLibsModule} from './app-libs.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PubmedComponent} from './content/pubmed/pubmed.component';
import {FlickrComponent} from './content/flickr/flickr.component';
import {TwitterComponent} from './content/twitter/twitter.component';
import {DbpediaComponent} from './content/dbpedia/dbpedia.component';

@NgModule({
  declarations: [
    AppComponent,
    PubmedComponent,
    FlickrComponent,
    TwitterComponent,
    DbpediaComponent
  ],
  imports: [
    AppLibsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
