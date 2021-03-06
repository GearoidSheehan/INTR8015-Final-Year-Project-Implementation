import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/models/userLogin';
import { UserRegister } from 'src/app/models/userRegister'
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  //passwordCheck: string;
  userLogin: UserLogin = {email: '', password: ''};

  userFor: UserRegister = {firstName: '', lastName: '', email: '', company: '', sector: '', password: ''};

  sectors: any [] = ['Information Technology', 'Health Care', 'Financials',
                        'Consumer Discretionary', 'Communication Services',
                        'Industrials', 'Consumer Staples', 'Energy',
                        'Utilities', 'Real Estate', 'Materials'];

  registerForm: FormGroup;

  constructor(private authService: AuthService, private alertifyService: AlertifyService,
              private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      inputFirstName: ['', [
        Validators.required
      ]],
      inputLastName: ['', [
        Validators.required
      ]],
      inputPassword: ['', [
        Validators.required
      ]],
      inputPasswordCheck: ['', [
        Validators.required
      ]],
      inputCompany: ['', [
        Validators.required
      ]],
      inputSector: ['', [
        Validators.required
      ]],
      inputEmail: ['', [
        Validators.required
      ]],
      acceptTerms: [false,
        Validators.requiredTrue]
    })
  }

  get inputFirstName() {
    return this.registerForm.get('inputFirstName')
  }

  get inputLastName() {
    return this.registerForm.get('inputLastName')
  }

  get inputPassword() {
    return this.registerForm.get('inputPassword')
  }

  get inputPasswordCheck() {
    return this.registerForm.get('inputPasswordCheck')
  }

  get inputCompany() {
    return this.registerForm.get('inputCompany')
  }

  get inputSector() {
    return this.registerForm.get('inputSector')
  }

  get inputEmail() {
    return this.registerForm.get('inputEmail')
  }

  get acceptTerms() {
    return this.registerForm.get('acceptTerms')
  }

  register() {

    const formData = new FormData();

    formData.append('FirstName', this.registerForm.get('inputFirstName').value);
    formData.append('LastName', this.registerForm.get('inputFirstName').value);
    formData.append('Password', this.registerForm.get('inputPassword').value);
    formData.append('PasswordCheck', this.registerForm.get('inputPasswordCheck').value);
    formData.append('Company', this.registerForm.get('inputCompany').value);
    formData.append('Sector', this.registerForm.get('inputSector').value);
    formData.append('Email', this.registerForm.get('inputEmail').value);

    if (this.registerForm.get('inputPassword').value == this.registerForm.get('inputPasswordCheck').value) {
      this.authService.register(formData).subscribe(next => {

        this.userLogin.email = this.registerForm.get('inputEmail').value;
        this.userLogin.password = this.registerForm.get('inputPassword').value;

        this.login();

      }, error => {
        this.alertifyService.error('Registration failed. Please try again.');
      });
    }
    else {
      this.alertifyService.error("Passwords do not match");
    }
  }

login() {

    this.authService.login(this.userLogin).subscribe(next => {
      this.alertifyService.success('Login Successful');
      this.router.navigate(['/home']);
    }, error => {
      this.alertifyService.error('Login failed');
    });
  }
}
