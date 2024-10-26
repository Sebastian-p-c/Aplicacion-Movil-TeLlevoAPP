import { Injectable } from '@angular/core';
import { StorageService } from './storage.service'; // Asegúrate de importar tu StorageService

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private viajesKey = 'viajes'; // Clave para el almacenamiento
  private initialized = false; // Bandera para comprobar si el almacenamiento está inicializado

  constructor(private storageService: StorageService) {
    this.init(); // Inicializa el almacenamiento al crear el servicio
  }

  // Método para inicializar el almacenamiento
  private async init() {
    await this.storageService.init(); // Asegúrate de inicializar el StorageService
    this.initialized = true; // Marca como inicializado
  }

  // Método para guardar el viaje en el almacenamiento
  async guardarViaje(viaje: any) {
    if (!this.initialized) {
      await this.init(); // Inicializa si no lo ha hecho
    }

    const viajesGuardados = await this.obtenerViajes();
    viajesGuardados.push(viaje); // Agrega el nuevo viaje al array
    await this.storageService.setItem(this.viajesKey, viajesGuardados); // Guarda en el StorageService
  }

  // Método para obtener todos los viajes guardados
  async obtenerViajes() {
    if (!this.initialized) {
      await this.init(); // Inicializa si no lo ha hecho
    }

    const viajes = await this.storageService.getItem(this.viajesKey);
    return viajes ? viajes : []; // Devuelve el array de viajes o un array vacío si no hay datos
  }
}


