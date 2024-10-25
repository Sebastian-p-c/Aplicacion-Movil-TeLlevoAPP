import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  message: string;
  username: string = '';
  password: string = '';

  // Definimos las credenciales del admin
  private adminUsername: string = 'admin';
  private adminPassword: string = 'admin'; // Cambia esto a la contraseña deseada

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService // Inyecta el servicio aquí
  ) {
    this.message = 'Bienvenido!';
  }

  clearInput() {
    this.username = '';  
  }

  clearPassword() {
    this.password = '';
  }

  async validateLogin() {
    console.log("Ejecutando validación");

    // Verifica si el usuario es el administrador
    if (this.username === this.adminUsername && this.password === this.adminPassword) {
      this.showToastMessage('Login correcto como Admin', 'success');
      this.router.navigate(['/principal']); // Cambia esto a la ruta que desees para el admin
    } else {
      // Si no es admin, verifica las credenciales almacenadas
      const storedCredentials = await this.storageService.getItem('userCredentials'); // Asumiendo que guardaste userCredentials

      if (storedCredentials) {
        const { username: storedUsername, password: storedPassword } = storedCredentials;

        // Validar los datos ingresados
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
