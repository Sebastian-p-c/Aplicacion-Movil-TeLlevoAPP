import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/services/viaje.service';
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

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.viajes = await this.viajeService.obtenerViajes();

    // Inicializa pasajeros disponibles si no está definido
    this.viajes.forEach((viaje) => {
      if (!viaje.pasajerosDisponibles) {
        viaje.pasajerosDisponibles = 4; // Máximo inicial
      }
    });
  }

  seleccionarViaje(viaje: any) {
    if (this.viajeSeleccionado === viaje) {
      this.viajeSeleccionado = null;
    } else {
      this.viajeSeleccionado = viaje;
      this.cantidadPasajeros = 1;
    }
  }

  incrementarPasajeros() {
    if (this.cantidadPasajeros < this.viajeSeleccionado.pasajerosDisponibles) {
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
    if (this.viajeSeleccionado.pasajerosDisponibles < this.cantidadPasajeros) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay suficientes pasajeros disponibles para este viaje.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const total = this.calcularTotal();
    this.viajeSeleccionado.pasajerosDisponibles -= this.cantidadPasajeros; // Reducir los pasajeros disponibles
    await this.viajeService.actualizarViaje(this.viajeSeleccionado); // Guardar los cambios

    const alert = await this.alertController.create({
      header: 'Confirmación de Viaje',
      message: `Se ha confirmado el viaje con un total de CLP ${total}`,
      buttons: ['OK'],
    });
    await alert.present();
    this.viajeSeleccionado = null;
  }
}
