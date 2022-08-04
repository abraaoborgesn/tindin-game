import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { returnAuthRoutesError } from 'src/app/helpers/returnAuthRoutesError';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  signIn() {
    console.log(this.signInForm.value.email);
    console.log(this.signInForm.value.password);
    console.log(this.signInForm.value);

    if (this.signInForm.valid) {
      this.spinner.show()
      this.authService.auth(this.signInForm.value).subscribe({
        next: (response) => {
          this.spinner.hide()
          this.toast.success('', 'Welcome')
          this.cookieService.set(
            'auth.token',
            response.token,
            60 * 60 * 24,
            '/'
          );
          this.router.navigate(['/']);
        },
        error: (err) => {
          const { message } = returnAuthRoutesError(err);
          this.toast.error(message)
          this.spinner.hide()
        },
      });
    }
  }
}
