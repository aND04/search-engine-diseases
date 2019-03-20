import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PubmedComponent} from "./content/pubmed/pubmed.component";
import {FlickrComponent} from "./content/flickr/flickr.component";
import {TwitterComponent} from "./content/twitter/twitter.component";

const routes: Routes = [
  {
    path: 'pubmed',
    component: PubmedComponent
  },
  {
    path: 'flickr',
    component: FlickrComponent
  },
  {
    path: 'twitter',
    component: TwitterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
