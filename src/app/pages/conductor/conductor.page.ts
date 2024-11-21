import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  selectedCard: string | null = null;

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  selectCard(card: string) {
    this.selectedCard = card;
  }

  continue() {
    if (this.selectedCard) {
      console.log('Tarjeta seleccionada:', this.selectedCard);
      if (this.selectedCard === 'viaje-entrega') {
        this.router.navigate(['/viaje-entrega']); 
      } else if (this.selectedCard === 'viaje') {
        this.router.navigate(['/forma-viaje']); 
      }
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
