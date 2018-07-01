import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
      private utils: UtilsService,
      private theme: ThemeService
  ) { }

  ngOnInit() {
  }

}
