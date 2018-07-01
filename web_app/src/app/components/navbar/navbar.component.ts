import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Tab } from '../tabs/tabs.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
      private utils: UtilsService
  ) { }

  tabs: Tab[] = [
      new Tab("Hoom", "home", "/hoom"),
      new Tab("Amusement", "subscriptions", "/amusement"),
      new Tab("Tjets", "chat_bubble", "/tjets"),
      new Tab("Mesnen & vriends", "group", "/vriends")
  ];

  ngOnInit() {
  }

}
