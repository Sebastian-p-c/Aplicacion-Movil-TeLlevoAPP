import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  currentUserId: number | null = null;
  datosConductorCompletos: boolean = false;

  selectedCard: string | null = null;

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    this.currentUserId = await this.storageService.getItem('currentUserId');

    if (this.currentUserId !== null) {
      const usuarios = await this.storageService.getItem('usuarios') || [];
      const usuario = usuarios.find((user: any) => user.id === this.currentUserId);
      this.datosConductorCompletos = !!usuario?.datosConductor;
    }
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
