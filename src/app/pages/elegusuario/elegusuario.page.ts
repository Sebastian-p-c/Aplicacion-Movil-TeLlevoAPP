import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-elegusuario',
  templateUrl: './elegusuario.page.html',
  styleUrls: ['./elegusuario.page.scss'],
})
export class ElegusuarioPage implements OnInit {
  username: string | null = null;// Reemplazamos usernameRegistro por username

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.username = navigation.extras.state['username']; // Reemplazo de usernameRegistro por username
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
      this.router.navigate(['/conductor'], { state: { username: this.username } }); // Reemplazo de usernameRegistro por username
    } else if (role === 'index') {
      this.router.navigate(['/index'], { state: { username: this.username } }); // Reemplazo de usernameRegistro por username
    }
  }
}

