import { Component, input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message: string;
  username: string = 'User';
  password: string = 'Password';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    this.message = 'Bienvenido!';
  }

  clearInput() {
    this.username = '';  
  }

  clearPassword(){
    this.password = '';
  }

  validateLogin(){
    console.log("Ejecutando validacion");
    const userValid: string = 'Mati';
    const pwdValid: string = '12345';

    if (this.username === userValid && this.password === pwdValid) {
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
