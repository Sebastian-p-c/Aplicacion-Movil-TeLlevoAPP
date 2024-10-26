import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  message: string;
  username: string = '';
  password: string = '';

  // Credenciales del administrador
  private adminUsername: string = 'admin';
  private adminPassword: string = 'admin';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService
  ) {
    this.message = 'Bienvenido!';
  }

  ngOnInit() {
    const storedContrast = localStorage.getItem('high-contrast');
    if (storedContrast === 'true') {
      document.body.classList.add('high-contrast');
    }
  }

  clearInput() {
    this.username = '';  
  }

  clearPassword() {
    this.password = '';
  }

  async validateLogin() {
    console.log("Ejecutando validación");

    if (this.username === this.adminUsername && this.password === this.adminPassword) {
      this.showToastMessage('Login correcto como Admin', 'success');
      this.router.navigate(['/principal']);
    } else {
      const storedCredentials = await this.storageService.getItem('userCredentials');

      if (storedCredentials) {
        const { username: storedUsername, password: storedPassword } = storedCredentials;

        if (this.username === storedUsername && this.password === storedPassword) {
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
      } else {
        this.showToastMessage('No hay datos de usuario registrados', 'warning');
      }
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
