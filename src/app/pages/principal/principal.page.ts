import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usuarios: any[] = []; // Array para almacenar los usuarios

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios(); // Cargar usuarios al iniciar la página
  }

  // Cargar todos los usuarios desde Storage
  async cargarUsuarios() {
    const userData = await this.storageService.getItem('userData');
    if (userData) {
      this.usuarios = [userData]; // Si tienes más de un usuario, ajusta este código para almacenar múltiples usuarios.
    }
  }

  // Eliminar un usuario
  async eliminarUsuario(uid: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.usuarios = this.usuarios.filter(usuario => usuario.usernameRegistro !== uid);
            await this.storageService.removeItem('userData'); // Elimina el usuario del Storage
            console.log(`Usuario con UID ${uid} eliminado`);
          },
        },
      ],
    });
    await alert.present();
  }

  // Navegar a la página de actualización con datos del usuario
  irAActualizarUsuario(uid: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        uid: uid,
      },
    };
    this.router.navigate(['/register'], navigationExtras); // Reutiliza la página de registro para actualizar
  }
}
