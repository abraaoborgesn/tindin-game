import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  isLogged: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private cookie: CookieService
  ) {
    this.isLogged = this.authService.isLogged;
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }

  handleSearch() {
    const query = this.searchInput.nativeElement.value;
    console.log(query);

    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  logout() {
    if (this.isLogged) {
      this.spinner.show();
      setTimeout(() => {
        this.cookie.delete('auth.token', '/');
        this.spinner.hide();
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/']));
      }, 2000);
    }
  }
}
