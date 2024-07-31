import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'OnlineOrderSystemApp';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    localStorage.clear();
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.router.navigate(['/login']);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !(event.url === '/login' || event.url === '/register');
      }
    });
  }
}
