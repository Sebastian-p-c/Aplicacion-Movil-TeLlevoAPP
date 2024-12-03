import { Injectable } from '@angular/core';
import { StorageService } from './storage.service'; 

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private viajesKey = 'viajes'; 
  private initialized = false; 

  constructor(private storageService: StorageService) {
    this.init(); 
  }

  private async init() {
    await this.storageService.init(); 
    this.initialized = true; 
  }

  async guardarViaje(viaje: any) {
    if (!this.initialized) {
      await this.init(); 
    }

    const viajesGuardados = await this.obtenerViajes();
    viajesGuardados.push(viaje);
    await this.storageService.setItem(this.viajesKey, viajesGuardados); 
  }

  async obtenerViajes() {
    if (!this.initialized) {
      await this.init(); 
    }

    const viajes = await this.storageService.getItem(this.viajesKey);
    return viajes ? viajes : []; 
  }

  async actualizarViaje(viajeActualizado: any) {
    const viajes = await this.obtenerViajes();
    const index = viajes.findIndex((v: any) => v.id === viajeActualizado.id);
    if (index !== -1) {
      viajes[index] = viajeActualizado;
      await this.storageService.setItem(this.viajesKey, viajes);
    }
  }
}


