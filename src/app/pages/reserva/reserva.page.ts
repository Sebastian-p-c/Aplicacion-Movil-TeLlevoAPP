import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/services/viaje.service';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = [];
  viajeSeleccionado: any = null;
  cantidadPasajeros: number = 1;
  paradaAdicional: string = '';
  map: any; // Referencia al mapa
  paradaCoords: { lat: number; lon: number } | null = null; // Coordenadas de la parada
  rutaPolyline: any; // Referencia a la línea de la ruta

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.viajes = await this.viajeService.obtenerViajes();

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
      this.cargarMapa(viaje.origenCoords, viaje.destinoCoords); // Cargar el mapa con la ruta
    }
  }

  cargarMapa(origenCoords: any, destinoCoords: any) {
    setTimeout(() => {
      if (this.map) {
        this.map.remove(); // Elimina el mapa anterior si existe
      }

      // Verifica que las coordenadas sean válidas
      if (!origenCoords || !destinoCoords) {
        console.error('Coordenadas inválidas para el origen o destino');
        return;
      }

      // Inicializar el mapa
      this.map = L.map('map').setView([origenCoords.lat, origenCoords.lon], 13);

      // Cargar mosaicos de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Marcar origen y destino
      const origenMarker = L.marker([origenCoords.lat, origenCoords.lon]).addTo(this.map).bindPopup('Origen').openPopup();
      const destinoMarker = L.marker([destinoCoords.lat, destinoCoords.lon]).addTo(this.map).bindPopup('Destino');

      // Solicitar la ruta desde OSRM
      this.obtenerRuta(origenCoords, destinoCoords);
    }, 300); // Espera un momento para que el contenedor se cargue
  }

  obtenerRuta(origenCoords: any, destinoCoords: any) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origenCoords.lon},${origenCoords.lat};${destinoCoords.lon},${destinoCoords.lat}?overview=full&geometries=geojson`;

    this.http.get(url).subscribe(
      (response: any) => {
        const coords = response.routes[0].geometry.coordinates;

        // Convertir coordenadas de [lon, lat] a [lat, lon]
        const route = coords.map((point: any) => [point[1], point[0]]);

        // Dibujar la ruta en el mapa
        this.rutaPolyline = L.polyline(route, { color: 'blue', weight: 5 }).addTo(this.map);

        // Ajustar el mapa a la ruta
        this.map.fitBounds(this.rutaPolyline.getBounds());

        // Habilitar clics para asignar parada
        this.habilitarClickParaParada();
      },
      (error) => {
        console.error('Error al obtener la ruta:', error);
      }
    );
  }

  habilitarClickParaParada() {
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      // Verificar si el punto está cerca de la ruta
      const punto = L.latLng(lat, lng);
      const distancia = this.rutaPolyline.getLatLngs().reduce((minDist: number, rutaPunto: any) => {
        const rutaLatLng = L.latLng(rutaPunto.lat, rutaPunto.lng);
        const dist = punto.distanceTo(rutaLatLng);
        return Math.min(minDist, dist);
      }, Infinity);

      // Si el punto está cerca de la ruta (por ejemplo, menos de 50 metros), permitir marcar la parada
      if (distancia < 50) {
        this.paradaCoords = { lat, lon: lng };
        this.paradaAdicional = `Parada en: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        // Agregar marcador en la parada seleccionada
        L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup('Parada seleccionada')
          .openPopup();
      } else {
        alert('Por favor, selecciona un punto más cercano a la ruta.');
      }
    });
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
    this.viajeSeleccionado.pasajerosDisponibles -= this.cantidadPasajeros;

    const parada = this.paradaAdicional?.trim();
    if (parada && this.paradaCoords) {
      this.viajeSeleccionado.paradaAdicional = {
        direccion: parada,
        coords: this.paradaCoords,
      };
    }

    await this.viajeService.actualizarViaje(this.viajeSeleccionado);

    const alert = await this.alertController.create({
      header: 'Confirmación de Viaje',
      message: `Se ha confirmado el viaje con un total de CLP ${total}${
        parada ? `, incluyendo una parada en: ${parada}` : ''
      }`,
      buttons: ['OK'],
    });
    await alert.present();

    this.viajeSeleccionado = null;
    this.paradaAdicional = '';
  }
}
