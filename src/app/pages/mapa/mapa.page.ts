import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map!: L.Map;

  startCoords: [number, number] = [-33.5024, -70.6132];
  endCoords: [number, number] = [-33.5024, -70.6132];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView(this.startCoords, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const startMarker = L.marker(this.startCoords).addTo(this.map).bindPopup("Duoc UC San Joaquín");
    const endMarker = L.marker(this.endCoords).addTo(this.map).bindPopup("Destino");

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
    // Lógica para cerrar sesión y redirigir a la página de inicio de sesión
    this.router.navigate(['/home']);
  }
}
