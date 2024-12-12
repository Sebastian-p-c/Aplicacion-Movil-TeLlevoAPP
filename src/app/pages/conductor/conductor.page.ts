import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  currentUserId: number | null = null;
  datosConductorCompletos: boolean = false;
  selectedCard: string | null = null;

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private storageService: StorageService
  ) { }

  async ionViewWillEnter() {
    const usuarios = await this.storageService.getItem('usuarios') || [];
    const currentUserId = await this.storageService.getItem('currentUserId');
    const usuario = usuarios.find((user: any) => user.id === currentUserId);

    if (usuario) {
      this.datosConductorCompletos = !!usuario?.datosConductor;

      if (!this.esMayorDeEdad(usuario.fechaNacimiento)) {
        const alert = await this.alertController.create({
          header: 'Acceso Denegado',
          message: 'Debes tener al menos 18 años para registrarte como conductor.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/elegusuario']);
      }
    }
  }

  esMayorDeEdad(fechaNacimiento: string): boolean {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    const dia = hoy.getDate() - fechaNac.getDate();

    return edad > 18 || (edad === 18 && (mes > 0 || (mes === 0 && dia >= 0)));
  }

  selectCard(card: string) {
    if (card === 'viaje' && !this.datosConductorCompletos) {
      this.alertController.create({
        header: 'Error',
        message: 'Debes registrar tus datos como conductor antes de generar un viaje.',
        buttons: ['OK']
      }).then(alert => alert.present());
      return;
    }
    this.selectedCard = card;
  }

  continue() {
    if (this.selectedCard === 'reg-conductor') {
      this.router.navigate(['/reg-conductor']);
    } else if (this.selectedCard === 'viaje' && this.datosConductorCompletos) {
      this.router.navigate(['/forma-viaje']);
    } else if (this.selectedCard === 'lista-conductor') {
      this.router.navigate(['/lista-conductor']);
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Realmente deseas salir?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Cerrar sesión');
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}
