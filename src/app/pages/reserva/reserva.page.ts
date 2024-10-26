import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/services/viaje.service'; // Asegúrate de importar tu servicio de viajes
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = [];
  viajeSeleccionado: any = null;
  cantidadPasajeros: number = 1;

  constructor(private router: Router,
              private viajeService: ViajeService,
              private alertController: AlertController) { }

  async  ngOnInit() {
    this.viajes = await this.viajeService.obtenerViajes();
  }

  logout() {
    console.log('Cerrar sesión');
    // Aquí puedes limpiar el localStorage si es necesario
    // localStorage.removeItem('userToken');  // Ejemplo

    // Redirigir a la página principal
    this.router.navigate(['/home']);  // Redirige a la página principal
  }

  seleccionarViaje(viaje: any) {
    this.viajeSeleccionado = viaje;
    this.cantidadPasajeros = 1; // Resetea la cantidad de pasajeros a 1 al seleccionar un viaje nuevo
  }

  incrementarPasajeros() {
    if (this.cantidadPasajeros < 4) {
      this.cantidadPasajeros++;
    }
  }

  decrementarPasajeros() {
    if (this.cantidadPasajeros > 1) {
      this.cantidadPasajeros--;
    }
  }

  calcularTotal(): number {
    return this.viajeSeleccionado.precioPasajero * this.cantidadPasajeros;
  }

  async confirmarViaje() {
    const total = this.calcularTotal();
    const alert = await this.alertController.create({
      header: 'Confirmación de Viaje',
      message: `Se ha confirmado el viaje con un total de CLP ${total}`,
      buttons: ['OK'],
    });
    await alert.present();
    this.viajeSeleccionado = null; // Limpia la selección después de confirmar
  }
}
