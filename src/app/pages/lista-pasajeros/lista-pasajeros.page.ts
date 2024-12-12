import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from 'src/services/storage.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-lista-pasajeros',
  templateUrl: './lista-pasajeros.page.html',
  styleUrls: ['./lista-pasajeros.page.scss'],
})
export class ListaPasajerosPage implements OnInit {
  viajeConfirmado: any = null; 
  pasajeros: any[] = [];
  currentUserId: string | null = null; 
  mostrarMensaje: boolean = false; 

  origenIcon = L.icon({
    iconUrl: 'assets/img/origin-icon.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  destinoIcon = L.icon({
    iconUrl: 'assets/img/destination-icon.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {

      this.currentUserId = await this.storageService.getItem('currentUserId');

      if (!this.currentUserId) {
        console.error('No se encontró el ID del usuario logueado.');
        return;
      }

      const viaje = await this.storageService.getItem('viajeConfirmado');

      if (!viaje) {
        console.error('No se encontraron datos del viaje confirmado.');
        return;
      }

      this.viajeConfirmado = viaje;

      this.pasajeros = Array(this.viajeConfirmado.cantidadPasajeros || 0)
        .fill({})
        .map((_, index) => ({
          nombre: `Pasajero ${index + 1}`,
          asiento: `Asiento ${index + 1}`,
        }));

      if (this.pasajeros.length === 0) {
        this.mostrarMensaje = true;
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }

}


