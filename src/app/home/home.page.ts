import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CommonServiceService } from 'src/app/common-service.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  weekdays: FormGroup;
  userDetails: any;
  dayName: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  totime: any;
  // Define a class property for storing formatted times
  formattedFromTime: string[] = [];
  formattedToTime: string[] = [];
  lastEnabledAddIndex: number = 0;


  constructor(public navCtrl: NavController,
    public commonService: CommonServiceService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router:Router) {

    this.weekdays = this.fb.group({

      Weekday1: this.fb.array([], Validators.required),
    });

  }



  ionViewWillEnter() {
    // this.addNewDay()
    this.userDetails = JSON.parse(localStorage.getItem('login') || '[]');
    if (this.userDetails) {
      const subjects = this.userDetails.Weekday1 || [];
      const weekdayArray = this.weekdays.get('Weekday1') as FormArray;
      weekdayArray.clear();
      subjects.forEach((day: any, index: number) => {
        console.log('dsdfdf', day);
        console.log('day.fromTime ::', day.fromTime)

        const fromTime = day.fromTime ? moment(day.fromTime, 'hh:mm a').toISOString() : null;
        const toTime = day.toTime ? moment(day.toTime, 'hh:mm a').toISOString() : null;


        weekdayArray.push(this.fb.group({
          dayName: [day.dayName, Validators.required],
          enabled: [day.enabled || false],
          fromTime: [fromTime, Validators.required],
          toTime: [toTime, Validators.required],
          email: this.userDetails.email
        }));

        // Set formatted times if they exist
        if (fromTime) {
          this.formattedFromTime[index] = this.formatTime(fromTime);
        }
        if (toTime) {
          this.formattedToTime[index] = this.formatTime(toTime);
        }

      });
    }
  }



  get dayControls() {
    return (this.weekdays.get('Weekday1') as FormArray).controls;
  }

  newDayAvailability(dayName: string): FormGroup {
    return this.fb.group({
      dayName: [dayName, Validators.required],
      enabled: [false, Validators.required],
      fromTime: [null],
      toTime: [null],
      email: this.userDetails.email,


    });
  }

  async addNewDay() {
    const addsubjectArray = this.weekdays.get('Weekday1') as FormArray;
    const existingDays = addsubjectArray.controls.map((control:any) => control.get('dayName')?.value);
    const nextDayName = this.dayName.find((day:any) => !existingDays.includes(day));
    if (nextDayName) {
      addsubjectArray.push(this.newDayAvailability(nextDayName));

    
    } else {
      this.commonService.presentAlert('Alert', 'You can add a maximum of 7 DaySchedule.');
    }
  }

  removeNewDay(index: number) {
    const removesubjectArray = this.weekdays.get('Weekday1') as FormArray;
    if (removesubjectArray.length > 0) {
      removesubjectArray.removeAt(index);
    }
  }

  toggleDay(index: number) {
    const dayGroup = (this.weekdays.get('Weekday1') as FormArray).at(index);
    const enabled = dayGroup?.get('enabled')?.value;
    

    const fromTimeControl = dayGroup.get('fromTime');
    const toTimeControl = dayGroup.get('toTime');

    if (enabled) {
        fromTimeControl?.setValidators([Validators.required]);
        toTimeControl?.setValidators([Validators.required]);
    } else {
            fromTimeControl?.clearValidators()
              toTimeControl?.clearValidators()
              fromTimeControl?.setValue('');
              toTimeControl?.setValue('');
             this.formattedFromTime[index] = 'Select FromTime';
             this.formattedToTime[index] = 'Select ToTime';
            }

            fromTimeControl?.updateValueAndValidity();
            toTimeControl?.updateValueAndValidity();

    const loginuser=JSON.parse(localStorage.getItem('login')||'[]');

    // if (Array.isArray(loginuser)) {
      console.log('terrific', loginuser)

        // const userworkIndex=loginuser.Weekday1.findIndex((i:any)=>i.enabled==false);
        let userworkIndex=loginuser.Weekday1.findIndex((i:any)=>i.email==this.userDetails.email);
        console.log('fire', userworkIndex)

        if(userworkIndex !== -1){
          loginuser.Weekday1=this.weekdays.value.Weekday1.map((c:any)=>
          ({
            dayName: c.dayName,
            enabled: c.enabled,
            fromTime:c.enabled?c.fromTime:'',
           toTime:c.enabled?c.toTime:'',
        
           email:c.email
          })) ;
          localStorage.setItem('login', JSON.stringify(loginuser));
        }
      }
    


  // Method to check and format time, updating the FormattedFromTime array
  checkTime(time: string, index: number, type: 'from' | 'to') {
    const formattedTime = this.formatTime(time);
    if (type === 'from') {
      this.formattedFromTime[index] = formattedTime;
      console.log('fnfknfkeknk', this.formattedFromTime)
    }
    else if (type === 'to') {
      this.formattedToTime[index] = formattedTime;
      console.log('dfefregrgrgr', this.formattedToTime)

    }

  }

  formatTime(timeString: string) {
    console.log('timeString', timeString)
    if(timeString){
    return moment(timeString).format('hh:mm a');}
    return 'Select Time';


  }

  validateTimeRange(fromTime: string, toTime: string): boolean {
    return moment(fromTime, 'hh:mm a').isBefore(moment(toTime, 'hh:mm a'));
  }


  setSchedule() {
    const isAnyTimeRangeInvalid = this.weekdays.value.Weekday1.some((d: any) =>
      d.enabled && !this.validateTimeRange(d.fromTime, d.toTime)
      // d.enabled && (!this.validateTimeRange(d.fromTime, d.toTime)|| !d.fromTime || !d.toTime )

    );

    if (isAnyTimeRangeInvalid) {
      this.commonService.presentAlert('Error', 'Invalid time range. Please check your inputs.');
      return;
    }

    let customerDetails = JSON.parse(localStorage.getItem('signup') || '[]');
    const userEmail = this.userDetails.email;

    const customerIndex = customerDetails.findIndex((c: any) => c.email === userEmail);
    if (customerIndex !== -1) {
      customerDetails[customerIndex].Weekday1 = this.weekdays.value.Weekday1.map((d: any) =>
      ({
        dayName: d.dayName,
        enabled: d.enabled,
        fromTime: d.fromTime ? this.formatTime(d.fromTime) : null,
        toTime: d.toTime ? this.formatTime(d.toTime) : null,
        email: d.email,

      }));
      
      localStorage.setItem('signup', JSON.stringify(customerDetails));
      localStorage.setItem('login', JSON.stringify(customerDetails[customerIndex]));

      console.log('Updated schedule:', this.weekdays.value);


       // Save to 'schedule' key
       let schedules = JSON.parse(localStorage.getItem('schedule') || '[]');
       const scheduleIndex = schedules.findIndex((s: any) => s.email === customerDetails.Email);
 
       if (scheduleIndex !== -1) {
         schedules[scheduleIndex].Weekday1 = customerDetails[customerIndex].Weekday1;
       } else {
         schedules.push({
           email: userEmail,
           Weekday1: customerDetails[customerIndex].Weekday1
         });
        }
 
       localStorage.setItem('schedule', JSON.stringify(schedules));
       this.commonService.presentAlert('Success', 'User details updated successfully!');

       console.log('Manage schedules:', schedules);

 

    }

  }

  logout() {
    localStorage.removeItem('login');

    this.router.navigate(['/login']);
    console.log("Logout clicked");

  
  }
}







