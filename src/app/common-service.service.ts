import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor( private toastController: ToastController,
    public alertCtrl: AlertController) { }

    async presentToast(msg: any) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 1500,
        position: 'bottom',
      });
    
      await toast.present();
    }
  
    async presentAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
}
