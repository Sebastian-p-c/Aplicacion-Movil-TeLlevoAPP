import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/services/viaje.service';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-lista-conductor',
  templateUrl: './lista-conductor.page.html',
  styleUrls: ['./lista-conductor.page.scss'],
})
export class ListaConductorPage implements AfterViewInit {
  viajes: any[] = [];
  viajesFiltrados: any[] = [];
  cantidadPasajeros: number = 0;
  rutaPolyline: any; 
  usuarioActualId: string | null = null;
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

  paradaIcon = L.icon({
    iconUrl: 'assets/img/stop-icon.png', 
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private http: HttpClient,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit() {
    this.usuarioActualId = await this.storageService.getItem('currentUserId');
    this.viajes = await this.viajeService.obtenerViajes();

    if (this.usuarioActualId !== null) {
      this.viajesFiltrados = this.viajes.filter(viaje => viaje.userId === this.usuarioActualId);
    } else {
      this.viajesFiltrados = this.viajes;
    }

    if (this.viajesFiltrados.length === 0) {
      this.mostrarMensaje = true;
    } else {
      this.viajesFiltrados.forEach((viaje) => {
        if (viaje.cantidadPasajeros === undefined || viaje.cantidadPasajeros === null) {
          viaje.cantidadPasajeros = 4; 
        }
      });
    }

    this.cdr.detectChanges();
  }
}