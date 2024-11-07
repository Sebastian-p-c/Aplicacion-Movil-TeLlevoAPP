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

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios(); 
  }


  async cargarUsuarios() {
    const userData = await this.storageService.getItem('userData');
    if (userData) {
      this.usuarios = [userData]; 
    }
  }

 
  async eliminarUsuario(uid: string) {                                         // Sugerencia de mejora futura: eliminar cualquier accion que haya realizado el usuario a eliminar
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
            await this.storageService.removeItem('userData'); 
            console.log(`Usuario con UID ${uid} eliminado`);
          },
        },
      ],
    });
    await alert.present();
  }

  
  irAActualizarUsuario(uid: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        uid: uid,
      },
    };
    this.router.navigate(['/register'], navigationExtras); 
  }

  irAlMenuPrincipal() {
    this.router.navigate(['/home']);
  }
}
