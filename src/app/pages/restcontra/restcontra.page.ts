import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-restcontra',
  templateUrl: './restcontra.page.html',
  styleUrls: ['./restcontra.page.scss'],
})
export class RestcontraPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {
    await this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Correo Enviado',
      message: 'Se ha enviado un mensaje a tu correo para restablecer la contraseña.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}
