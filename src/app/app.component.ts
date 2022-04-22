import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { fadeing } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeing,
  ]
})
export class AppComponent implements OnInit {
  title = 'form-app';
  registrationForm: FormGroup;
  public navView = true;

  showheader: boolean;

  // if navigation to login page is successful, then don't show header for admin functions
  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // if register or login page navigated, dont show
        if (
          event.url === '/admin' ||
          event.url === '/admin/service-requests' ||
          event.url === '/admin/reset-password' ||
          event.url === '/admin/review-request' ||
          event.url === '/admin/service-request-detail'
        ) {
          this.showheader = false;
        } else {
          this.showheader = true;
        }
      }
    });
  }

  prepareRouter(outlet:RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animations'];
  }

  @HostListener('window: resize', ['$event'])
  onResize(event){
    this.navView = window.innerWidth > 800 ? true : false;
  }

  ngOnInit(): void {
    this.navView = window.innerWidth > 800 ? true : false;
  }
}
