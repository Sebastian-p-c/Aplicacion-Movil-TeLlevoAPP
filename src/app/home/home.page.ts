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
  message: string = 'Bienvenido!';
  username: string = '';
  password: string = '';

  // Credenciales del administrador
  private adminUsername: string = 'admin';
  private adminPassword: string = 'admin';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const storedContrast = localStorage.getItem('high-contrast');
    if (storedContrast === 'true') {
      document.body.classList.add('high-contrast');
    }
  }

  // Método para limpiar el campo del nombre de usuario
  clearInput() {
    this.username = '';
  }

  // Método para limpiar el campo de la contraseña
  clearPassword() {
    this.password = '';
  }

  // Validación del inicio de sesión
  async validateLogin() {
    console.log("Ejecutando validación");
  
    // Verificar si se trata del administrador
    if (this.username === this.adminUsername && this.password === this.adminPassword) {
      this.showToastMessage('Login correcto como Admin', 'success');
      this.router.navigate(['/principal']);
      return;
    }
  
    // Verificar usuarios registrados
    const usuarios = await this.storageService.getItem('usuarios');
  
    if (usuarios && Array.isArray(usuarios)) {
      const usuarioEncontrado = usuarios.find(
        (user: any) => user.nombre === this.username && user.password === this.password
      );
  
      if (usuarioEncontrado) {
        // Guardar el ID del usuario logueado en el almacenamiento
        await this.storageService.setItem('currentUserId', usuarioEncontrado.id);
        this.showToastMessage('Login correcto', 'success');
  
        // Navegar a la página con información del usuario logueado
        const extras: NavigationExtras = {
          state: {
            nombre: usuarioEncontrado.nombre,
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

  // Mostrar un mensaje en un toast
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
