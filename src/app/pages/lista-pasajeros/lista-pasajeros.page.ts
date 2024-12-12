import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

interface Pasajero {
  nombre: string;
  detalle: any;
}

@Component({
  selector: 'app-lista-pasajeros',
  templateUrl: './lista-pasajeros.page.html',
  styleUrls: ['./lista-pasajeros.page.scss'],
})
export class ListaPasajerosPage implements OnInit {
  pasajeros: Pasajero[] = [];
  viajeConfirmado: any;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.cargarPasajeros();
  }
  

  async cargarPasajeros() {
    this.viajeConfirmado = await this.storageService.getItem('viajeConfirmado');
    if (this.viajeConfirmado && this.viajeConfirmado !== null) {
      const conductor = this.viajeConfirmado.conductor;
      const origen = this.viajeConfirmado.origen;
      const destino = this.viajeConfirmado.destino;
      const cantidadPasajeros = this.viajeConfirmado.cantidadPasajeros;
      const paradaAdicional = this.viajeConfirmado.paradaAdicional;
      const fecha = this.viajeConfirmado.fecha;
      const total = this.viajeConfirmado.total;

      this.pasajeros.push({
        nombre: conductor.nombre,
        detalle: `Conductor - ${origen} a ${destino}`,
      });
      for (let i = 0; i < cantidadPasajeros; i++) {
        this.pasajeros.push({
          nombre: `Pasajero ${i + 1}`,
          detalle: `Asiento ${i + 1}`,
        });
      }
      if (paradaAdicional) {
        this.pasajeros.push({
          nombre: 'Parada adicional',
          detalle: paradaAdicional.direccion,
        });
      }
      this.pasajeros.push({
        nombre: 'Fecha del viaje',
        detalle: fecha,
      });
      this.pasajeros.push({
        nombre: 'Total pagado',
        detalle: total,
      });
    } else {
      console.log('No hay viaje confirmado');
    }
  }
}