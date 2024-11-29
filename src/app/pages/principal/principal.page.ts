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
  usuarios: any[] = []; // Lista de usuarios
  username: string = ''; // Nombre de usuario actual
  userdata: any = null; // Datos adicionales del usuario actual
  usercredentials: any = null; // Credenciales adicionales del usuario actual

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  /**
   * Método inicial del componente
   */
  async ngOnInit() {
    // Recuperar datos adicionales desde el estado de navegación
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.username = state['username'] || '';
      this.userdata = state['userdata'] || null;
      this.usercredentials = state['usercredentials'] || null;
    }

    // Cargar lista de usuarios desde el almacenamiento
    await this.cargarUsuarios();
  }

  /**
   * Carga los usuarios almacenados.
   */
  async cargarUsuarios() {
    try {
      const usuarios = await this.storageService.getItem('usuarios');
      if (usuarios && Array.isArray(usuarios)) {
        this.usuarios = usuarios;
      } else {
        console.log('No hay usuarios almacenados.');
        this.usuarios = [];
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  /**
   * Elimina un usuario del almacenamiento.
   * @param usuario Usuario a eliminar.
   */
  async eliminarUsuario(usuario: any) {
    // Verificar si el usuario es el administrador y evitar su eliminación
    if (usuario.username === 'admin') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes eliminar al administrador.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Confirmar eliminación del usuario
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${usuario.username}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              // Eliminar usuario de la lista y actualizar almacenamiento
              this.usuarios = this.usuarios.filter((u) => u.username !== usuario.username);
              await this.storageService.setItem('usuarios', this.usuarios);

              console.log(`Usuario con username ${usuario.username} eliminado del almacenamiento.`);

              // Notificar éxito
              const successAlert = await this.alertController.create({
                header: 'Usuario eliminado',
                message: `El usuario ${usuario.username} ha sido eliminado correctamente.`,
                buttons: ['OK'],
              });
              await successAlert.present();
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Navega a la página de actualización del usuario.
   * @param usuario Usuario a actualizar.
   */
  irAActualizarUsuario(usuario: any) {
    if (!usuario.username) {
      console.error('El usuario no tiene un nombre de usuario válido.');
      return;
    }

    const navigationExtras: NavigationExtras = {
      state: {
        username: usuario.username,
      },
    };
    this.router.navigate(['/register'], navigationExtras);
  }

  
  /**
   * Navega al menú principal.
   */
  irAlMenuPrincipal() {
    this.router.navigate(['/home']);
  }
}
