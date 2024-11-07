import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-elegusuario',
  templateUrl: './elegusuario.page.html',
  styleUrls: ['./elegusuario.page.scss'],
})
export class ElegusuarioPage implements OnInit {
  usernameRegistro: string = ''; 

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.usernameRegistro = navigation.extras.state['usernameRegistro'];
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Realmente deseas salir?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Cerrar sesión');
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  navigateTo(role: string) {
    if (role === 'conductor') {
      this.router.navigate(['/conductor'], { state: { usernameRegistro: this.usernameRegistro } });
    } else if (role === 'index') {
      this.router.navigate(['/index'], { state: { usernameRegistro: this.usernameRegistro } });
    }
  }
}

