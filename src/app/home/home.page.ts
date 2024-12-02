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

  // Datos adicionales
  userdata: any = null;
  usercredentials: any = null;

  // Credenciales del administrador
  private readonly adminUsername: string = 'admin';
  private readonly adminPassword: string = 'admin';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // Verificar si el modo de alto contraste está activado
    const storedContrast = localStorage.getItem('high-contrast');
    if (storedContrast === 'true') {
      document.body.classList.add('high-contrast');
    }

    // Cargar datos adicionales almacenados
    this.loadStoredData();
  }

  /**
   * Cargar datos adicionales del almacenamiento
   */
  async loadStoredData() {
    try {
      this.userdata = await this.storageService.getItem('userdata');
      console.log('Userdata:', this.userdata);

      this.usercredentials = await this.storageService.getItem('usercredentials');
      console.log('Usercredentials:', this.usercredentials);

      const usuarios = await this.storageService.getItem('usuarios');
      console.log('Usuarios:', usuarios); // Verifica la estructura aquí
    } catch (error) {
      console.error('Error cargando los datos del almacenamiento:', error);
    }
  }

  /**
   * Limpiar el campo del nombre de usuario
   */
  clearInput() {
    this.username = '';
  }

  /**
   * Limpiar el campo de la contraseña
   */
  clearPassword() {
    this.password = '';
  }

  /**
   * Validación del inicio de sesión
   */
  async validateLogin() {
    console.log('Ejecutando validación');

    // Verificar si las credenciales coinciden con el administrador
    if (this.username === this.adminUsername && this.password === this.adminPassword) {
      this.showToastMessage('Login correcto como Admin', 'success');
      this.router.navigate(['/principal']);
      return;
    }

    // Verificar usuarios registrados en el almacenamiento
    try {
      const usuarios = await this.storageService.getItem('usuarios');

      if (usuarios && Array.isArray(usuarios)) {
        const usuarioEncontrado = usuarios.find(
          (user: any) => user.username === this.username && user.password === this.password
        );

        if (usuarioEncontrado) {
          // Guardar el ID del usuario logueado en el almacenamiento
          await this.storageService.setItem('currentUserId', usuarioEncontrado.id);
          this.showToastMessage('Login correcto', 'success');

          // Navegar con datos adicionales
          const extras: NavigationExtras = {
            state: {
              username: usuarioEncontrado.username,
              userdata: this.userdata || null,
              usercredentials: this.usercredentials || null,
            },
          };
          this.router.navigate(['/elegusuario'], extras);
        } else {
          this.showToastMessage('Login incorrecto', 'danger');
        }
      } else {
        this.showToastMessage('No hay datos de usuario registrados', 'warning');
      }
    } catch (error) {
      console.error('Error durante la validación del login:', error);
      this.showToastMessage('Error al validar el inicio de sesión', 'danger');
    }
  }

  /**
   * Mostrar un mensaje en un toast
   * @param message Mensaje a mostrar
   * @param color Color del toast (success, warning, danger)
   */
  async showToastMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      duration: 1500, // Duración extendida para mejorar la visibilidad
      message,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}
