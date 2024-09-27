import { CanActivateFn} from '@angular/router';
import { inject } from '@angular/core';
// import { Observable } from 'rxjs';
import {Router} from '@angular/router';
import { CommonServiceService } from 'src/app/common-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const commonService = inject(CommonServiceService);
  const router = inject(Router);

    const userData = localStorage.getItem('login');
    // const scheduleData = localStorage.getItem('schedule') 
    if (userData) {
      return true; // Data is available, allow navigation
    } else {
      router.navigate(['/login']); // Redirect to login page
      commonService.presentToast('Not Authenticated');
      return false; // Prevent navigation
    }
}
  

