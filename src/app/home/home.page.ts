import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message: string;
  username: string = '';
  password: string = '';

  validUsers = [
    { username: 'Mati', password: '12345' },
    { username: 'Alex', password: '54321' }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    this.message = 'Bienvenido!';
  }

  clearInput() {
    this.username = '';  
  }

  clearPassword() {
    this.password = '';
  }

  validateLogin() {
    console.log("Ejecutando validación");

    // Verificar si las credenciales coinciden con algún usuario válido
    const userFound = this.validUsers.find(user => 
      user.username === this.username && user.password === this.password
    );

    if (userFound) {
      this.showToastMessage('Login correcto', 'success');

      const extras: NavigationExtras = {
        state: {
          user: this.username,
        },
      };

      this.router.navigate(['/elegusuario'], extras);
    } else {
      this.showToastMessage('Login incorrecto', 'danger');
    }
  }

  async showToastMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      duration: 500,
      message,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}
