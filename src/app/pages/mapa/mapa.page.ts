import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map!: L.Map;

  startCoords: [number, number] = [-33.5024, -70.6132];
  endCoords: [number, number] = [-33.5024, -70.6132];

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView(this.startCoords, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.obtenerMiUbicacion();

    this.getRoute();
  }

  getRoute() {
    const apiKey = '5b3ce3597851110001cf6248f427dedb77764371a567708d0f27cc41';
    const start = this.startCoords.join(',');
    const end = this.endCoords.join(',');

    this.http.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
      params: {
        api_key: apiKey,
        start: start,
        end: end,
      }
    }).subscribe((response: any) => {
      const route = L.geoJSON(response.routes[0].geometry).addTo(this.map);
      this.map.fitBounds(route.getBounds());
    }, error => {
      console.error('Error al obtener la ruta:', error);
    });
  }

  logout() {
    this.router.navigate(['/home']);
  }

  async obtenerMiUbicacion() {
    try {

      const ubicacion = await Geolocation.getCurrentPosition();
      const userCoords: [number, number] = [ubicacion.coords.latitude, ubicacion.coords.longitude];

      const userCircle = L.circleMarker(userCoords, {
        color: '#007bff', 
        fillColor: '#3399FF', 
        fillOpacity: 0.5,     
        radius: 10            
      }).addTo(this.map)

      this.map.setView(userCoords, 17);

      const ubicacionTexto = `Latitud: ${ubicacion.coords.latitude}, Longitud: ${ubicacion.coords.longitude}`;
      this.mostrarToast(ubicacionTexto);

    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      this.mostrarToast("No se pudo obtener la ubicación.");
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: "top",
    });

    await toast.present();
  }
}
