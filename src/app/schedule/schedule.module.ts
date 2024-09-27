import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';

const routes: Routes=[
  {
    path: '',
    component:SchedulePage


  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SchedulePageRoutingModule,
    RouterModule.forChild(routes)

  ],
  declarations: [SchedulePage]
})
export class SchedulePageModule {}
