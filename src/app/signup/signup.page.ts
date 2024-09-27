import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonServiceService } from 'src/app/common-service.service';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage  {

  signupForm:FormGroup;


  constructor(public CommonService:CommonServiceService) {

    this.signupForm=new FormGroup({
      role:new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      employeeId: new FormControl(''),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      address: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required,Validators.pattern(StrongPasswordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
    },{ validators: this.PasswordMatchValidator });
   }

   get passwordFormField() {
    return this.signupForm.get('password');
    // return this.signupForm.get('confirmPassword');

  }

  PasswordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };



    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;

    }
  }

  signup(){
    if(this.signupForm.valid){
      if(this.signupForm.value.role=='Manager'){
        this.signupForm.value.ManagerId=Math.floor(Math.random()*100)
      }

      let getsignupForm=localStorage.getItem('signup');
      let mysignup=getsignupForm ? JSON.parse(getsignupForm) : [];

      let existingemails = mysignup.map((entry:any)=>entry.email);
      const enteredemail=this.signupForm.value.email;
      if(existingemails.includes(enteredemail)){
        this.CommonService.presentToast('Email is already in use.Pls choose different mailId.');
      }

      if(this.signupForm.value.role=='Employee'){
      let existingemployeeId = mysignup.map((e:any)=>e.employeeId);
      const enteredemployeeId = this.signupForm.value.employeeId;
      if(existingemployeeId.includes(enteredemployeeId)){
        this.CommonService.presentToast('EmpId is already in use. Pls choose different EmpId.');

        return;

      }
}

mysignup.push(this.signupForm.value);
localStorage.setItem('signup', JSON.stringify(mysignup));
console.log('Form Submitted:', this.signupForm.value);
this.CommonService.presentToast('Signup Successful');
this.signupForm.reset();


  }

  else{
    console.log('Form NotSubmitted',this.signupForm.errors);
    this.CommonService.presentToast('Form is Invalid. Cannot Submit');
  }
}

}


  


