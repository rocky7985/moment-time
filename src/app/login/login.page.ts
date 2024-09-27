import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from 'src/app/common-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;
  showPassword = false;
  text: any = 'password';
  name: any = 'eye-off-outline';

  constructor(
    public CommonService: CommonServiceService,
    public router: Router
  ) { this.loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,])),
    password: new FormControl('', Validators.compose([Validators.required,]))})
}

login(){
  if (this.loginForm.valid) {
    const userData = localStorage.getItem('signup');

    const users = userData ? JSON.parse(userData) : [];



    const enteredEmail = this.loginForm.value.email;
    const enteredPassword = this.loginForm.value.password;
    const user = users.find((u: any) => u.email === enteredEmail && u.password === enteredPassword);

    console.log('=====', user);

    if (user) {

      localStorage.setItem("login", JSON.stringify(user));


      console.log('Login successful', this.loginForm.value);
      this.CommonService.presentToast('User Login Successful');

      if (user.role === 'Manager') {
        this.router.navigate(['/home']);
      }

      // if (user.role === 'Employee') {
      //   this.router.navigate(['/tabs/home']);
      // }

      console.log("Form Submitted!");
      this.loginForm.reset();
    }

    else {
      this.CommonService.presentToast('Invalid email or password');
    }

  }

  else {
    console.log('Form is invalid. Cannot login.');
  }

}

changetype() {
  this.text = this.text == 'text' ? 'password' : 'text'
  this.name = this.name == 'eye-outline' ? 'eye-off-outline' : 'eye-outline'
}

toggleShow() {
  this.showPassword = !this.showPassword;
}

}
