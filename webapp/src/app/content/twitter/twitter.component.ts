import { Component, OnInit } from '@angular/core';
import {TwitterService} from "./twitter.service";

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

  constructor(private twitterService: TwitterService) { }

  ngOnInit() {
  }

  onClick() {
    this.twitterService.getTweets('asthma').subscribe(res => console.log(res));
  }

}
