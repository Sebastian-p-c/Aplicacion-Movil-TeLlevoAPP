import { Component } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage {
  map!: L.Map;
  startCoords: [number, number] = [0, 0];
  endCoords: [number, number] = [0, 0];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.startCoords = [Number(params['origenLat']), Number(params['origenLon'])];
      this.endCoords = [Number(params['destinoLat']), Number(params['destinoLon'])];
      this.loadMap();
    });
  }

  loadMap() {
    if (this.map) {
      this.map.remove(); 
    }

    this.map = L.map('map').setView(this.startCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const endIcon = L.icon({
      iconUrl: 'assets/img/origin-icon.png', 
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    L.marker(this.endCoords, { icon: endIcon }).addTo(this.map).bindPopup("");

    this.getRoute();
    this.obtenerMiUbicacion();
  }

  async getRoute() {
    const apiKey = '5b3ce3597851110001cf6248472a0cc092584bf08b43f0aa65607adb';
    const start = this.startCoords.reverse().join(',');
    const end = this.endCoords.reverse().join(',');

    try {
      const response: any = await this.http.get(`https://api.openrouteservice.org/v2/directions/driving-car`, {
        params: {
          api_key: apiKey,
          start: start,
          end: end,
        }
      }).toPromise();

      console.log('API Response:', response); 

      if (response && response.features && response.features.length > 0) {
        const routeGeometry = response.features[0].geometry.coordinates;

        const latLngs: L.LatLngTuple[] = routeGeometry.map((coords: [number, number]) => [coords[1], coords[0]]);
        
        const route = L.polyline(latLngs, {
          color: 'black',
          weight: 4
        }).addTo(this.map);

        this.map.fitBounds(route.getBounds());
      } else {
        console.error('No se encontró una ruta en la respuesta');
        this.mostrarToast("No se encontró una ruta.");
      }
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
      this.mostrarToast("Error al obtener la ruta.");
    }
  }

  async obtenerMiUbicacion() {
    try {
      const ubicacion = await Geolocation.getCurrentPosition();
      const userCoords: [number, number] = [ubicacion.coords.latitude, ubicacion.coords.longitude];

      L.circleMarker(userCoords, {
        color: '#007bff',
        fillColor: '#3399FF',
        fillOpacity: 0.5,
        radius: 10
      }).addTo(this.map).bindPopup("Tu ubicación");

      this.map.setView(userCoords, 15);
      this.mostrarToast(`Tu ubicación actual: ${ubicacion.coords.latitude.toFixed(4)}, ${ubicacion.coords.longitude.toFixed(4)}`);
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      this.mostrarToast("No se pudo obtener la ubicación.");
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 500,
      position: "bottom",
    });
    await toast.present();
  }

  logout() {
    this.router.navigate(['/home']);
  }
}
