import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage {

  workSchedule: any[] = [];
  loggedInUser: any;


  constructor() {

  }

  ionViewWillEnter() {

    this.workScheduleList();
  }

  workScheduleList() {
    // this.workSchedule=[];

    const savedSchedule: [] = JSON.parse(localStorage.getItem('schedule') || '[]');
    this.loggedInUser = JSON.parse(localStorage.getItem('login') || '[]');
    console.log('triumph', savedSchedule);
    // this.workSchedule.patchValue(this.loggedInUser.Weekday1) mistake
    if (this.loggedInUser && this.loggedInUser.email) {

      savedSchedule.forEach((t: any) => {
        if (t.email === this.loggedInUser.email) {
          this.workSchedule = t.Weekday1;
          // this.workSchedule.push(t);implemented in aboveline in another way
          console.log('Schedule List:', t)
        }
      });
      if (this.workSchedule.length === 0) {
        console.log('No Schedule is fixed');
      } else {
        console.log('Scheduled:', this.workSchedule);
      }
      console.log('S list:', this.workSchedule)

    }

    else {
      console.log('Invalid schedule data or user login information');

    }
  }

}
