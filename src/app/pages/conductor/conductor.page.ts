import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  selectedCard: string | null = null;  // Variable para almacenar la tarjeta seleccionada

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Función para seleccionar una tarjeta
  selectCard(card: string) {
    this.selectedCard = card;
  }

  // Función para continuar con la tarjeta seleccionada
  continue() {
    if (this.selectedCard) {
      console.log('Tarjeta seleccionada:', this.selectedCard);
      // Aquí puedes agregar la lógica para proceder con la tarjeta seleccionada
      // Por ejemplo, podrías redirigir a otra página basada en la selección:
      if (this.selectedCard === 'viaje-entrega') {
        this.router.navigate(['/viaje-entrega']);  // Redirige a la página de viajes/entregas
      } else if (this.selectedCard === 'viaje') {
        this.router.navigate(['/forma-viaje']);  // Redirige a la página de viajes
      }
    }
  }

  // Función para cerrar sesión
  logout() {
    console.log('Cerrar sesión');
    // Aquí puedes limpiar el localStorage si es necesario
    // localStorage.removeItem('userToken');  // Ejemplo

    // Redirigir a la página principal
    this.router.navigate(['/home']);  // Redirige a la página principal
  }
}
