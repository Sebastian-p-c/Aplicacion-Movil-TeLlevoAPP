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
  usuarios: any[] = [];
  nombre: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['nombre']) {
      this.nombre = state['nombre'];
    }
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    const usuarios = await this.storageService.getItem('usuarios');
    if (usuarios && Array.isArray(usuarios)) {
      this.usuarios = usuarios;
    } else {
      console.log('No hay usuarios almacenados.');
    }
  }

  async eliminarUsuario(usuario: any) {
    if (usuario.nombre === 'admin') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes eliminar al administrador.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${usuario.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.usuarios = this.usuarios.filter((u) => u.nombre !== usuario.nombre);

            await this.storageService.setItem('usuarios', this.usuarios);

            console.log(`Usuario con nombre ${usuario.nombre} eliminado del almacenamiento.`);

            const successAlert = await this.alertController.create({
              header: 'Usuario eliminado',
              message: `El usuario ${usuario.nombre} ha sido eliminado correctamente.`,
              buttons: ['OK'],
            });
            await successAlert.present();
          },
        },
      ],
    });
    await alert.present();
  }

  irAActualizarUsuario(usuario: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        nombre: usuario.nombre, 
      },
    };
    this.router.navigate(['/register'], navigationExtras);
  }


  irAlMenuPrincipal() {
    this.router.navigate(['/home']);
  }
}
