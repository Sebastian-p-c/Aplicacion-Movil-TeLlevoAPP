import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forma-viaje',
  templateUrl: './forma-viaje.page.html',
  styleUrls: ['./forma-viaje.page.scss'],
})
export class FormaViajePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cantidad: number = 0;

  incrementarCantidad() {
    this.cantidad++;
  }

  decrementarCantidad() {
    if (this.cantidad > 0) { // Evita valores negativos
      this.cantidad--;
    }
  }

  logout() {
    console.log('Cerrar sesión');
    // Aquí puedes limpiar el localStorage si es necesario
    // localStorage.removeItem('userToken');  // Ejemplo

    // Redirigir a la página principal
    this.router.navigate(['/home']);  // Redirige a la página principal
  }

  selectedBanco: string = '';  
  selectedTipoCuenta: string = '';  

  onIonChange(event: CustomEvent, field: string) {
    if (field === 'banco') {
      this.selectedBanco = event.detail.value;
    } else if (field === 'tipoCuenta') {
      this.selectedTipoCuenta = event.detail.value;
    }
  }

  onDidDismiss(event: CustomEvent, field: string) {
    if (event.detail.role === 'confirm') {
      if (field === 'banco') {
        this.selectedBanco = event.detail.data;
      } else if (field === 'tipoCuenta') {
        this.selectedTipoCuenta = event.detail.data;
      }
    }
  }

}
