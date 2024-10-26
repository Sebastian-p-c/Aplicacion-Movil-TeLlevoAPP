import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  selectedCard: string | null = null;

  constructor(private router: Router) { }

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

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/home']);
  }
}
