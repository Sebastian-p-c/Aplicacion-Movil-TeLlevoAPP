import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/services/viaje.service';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/services/storage.service'; // Asegúrate de importar el StorageService

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = [];
  viajeSeleccionado: any = null;
  cantidadPasajeros: number = 0;
  fechaViaje: string = '';
  paradaAdicional: string = '';
  map: any; 
  paradaCoords: { lat: number; lon: number } | null = null; 
  rutaPolyline: any; 
  paradaMarker: any = null;
  usuarioActualId: string | null = null;

  
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
    private storageService: StorageService // Inyectar el StorageService
  ) {}

  async ngOnInit() {
    this.usuarioActualId = await this.storageService.getItem('currentUserId');
    this.viajes = await this.viajeService.obtenerViajes();

    this.viajes.forEach((viaje) => {
      if (viaje.cantidadPasajeros === undefined || viaje.cantidadPasajeros === null) {
        viaje.cantidadPasajeros = 4; 
      }
    });
    
  }

  seleccionarViaje(viaje: any) {
    if (this.viajeSeleccionado === viaje) {
      this.viajeSeleccionado = null;
      this.cantidadPasajeros = 0;
      this.fechaViaje = "";
    } else {
      this.viajeSeleccionado = viaje;
      this.cantidadPasajeros = 0;
      this.fechaViaje = "";
      this.cargarMapa(viaje.origenCoords, viaje.destinoCoords); // Cargar el mapa con la ruta
    }
  }

  cargarMapa(origenCoords: any, destinoCoords: any) {
    setTimeout(() => {
      if (this.map) {
        this.map.remove(); 
      }

      
      if (!origenCoords || !destinoCoords) {
        console.error('Coordenadas inválidas para el origen o destino');
        return;
      }

      
      this.map = L.map('map').setView([origenCoords.lat, origenCoords.lon], 13);

      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker([origenCoords.lat, origenCoords.lon], { icon: this.origenIcon })
        .addTo(this.map)
        .bindPopup('Origen')
        .openPopup();

      L.marker([destinoCoords.lat, destinoCoords.lon], { icon: this.destinoIcon })
        .addTo(this.map)
        .bindPopup('Destino');

      this.obtenerRuta(origenCoords, destinoCoords);
    }, 300);
  }

  obtenerRuta(origenCoords: any, destinoCoords: any) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origenCoords.lon},${origenCoords.lat};${destinoCoords.lon},${destinoCoords.lat}?overview=full&geometries=geojson`;

    this.http.get(url).subscribe(
      (response: any) => {
        const coords = response.routes[0].geometry.coordinates;

        
        const route = coords.map((point: any) => [point[1], point[0]]);

        
        this.rutaPolyline = L.polyline(route, { color: 'blue', weight: 5 }).addTo(this.map);

  
        this.map.fitBounds(this.rutaPolyline.getBounds());

      
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

      
      const punto = L.latLng(lat, lng);
      const distancia = this.rutaPolyline.getLatLngs().reduce((minDist: number, rutaPunto: any) => {
        const rutaLatLng = L.latLng(rutaPunto.lat, rutaPunto.lng);
        const dist = punto.distanceTo(rutaLatLng);
        return Math.min(minDist, dist);
      }, Infinity);

      
      if (distancia < 50) {
        this.paradaCoords = { lat, lon: lng };
        this.paradaAdicional = `Parada en: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        
        if (this.paradaMarker) {
          this.paradaMarker.setLatLng([lat, lng]).bindPopup('Parada seleccionada').openPopup();
        } else {
    
          this.paradaMarker = L.marker([lat, lng], { icon: this.paradaIcon })
            .addTo(this.map)
            .bindPopup('Parada seleccionada')
            .openPopup();
        }
      } else {
        alert('Por favor, selecciona un punto más cercano a la ruta.');
      }
    });
  }

  incrementarPasajeros() {
    const pasajerosRestantes = this.viajeSeleccionado.cantidadPasajeros - this.cantidadPasajeros;
  
    if (pasajerosRestantes > 1) {
      this.cantidadPasajeros++;
    } 
  }
  
  decrementarPasajeros() {
    if (this.cantidadPasajeros > 0) {
      this.cantidadPasajeros--;
    }
  }
  
  calcularTotal(): number {
    return this.viajeSeleccionado.precioPasajero * (this.cantidadPasajeros + 1);
  }

  async confirmarViaje() {
    if (this.viajeSeleccionado.cantidadPasajeros < this.cantidadPasajeros) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay suficientes pasajeros disponibles para este viaje.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const total = this.calcularTotal();
    this.viajeSeleccionado.cantidadPasajeros -= 1;
    this.viajeSeleccionado.cantidadPasajeros -= this.cantidadPasajeros;

    const parada = this.paradaAdicional?.trim();
    if (parada && this.paradaCoords) {
      this.viajeSeleccionado.paradaAdicional = {
        direccion: parada,
        coords: this.paradaCoords,
      };
    }

    await this.viajeService.actualizarViaje(this.viajeSeleccionado);

    // Almacenar el viaje confirmado en el almacenamiento
    const viajeConfirmado = {
      conductor: this.viajeSeleccionado.conductor,
      origen: this.viajeSeleccionado.origen,
      destino: this.viajeSeleccionado.destino,
      fecha: this.viajeSeleccionado.fecha,
      cantidadPasajeros: this.cantidadPasajeros,
      paradaAdicional: this.viajeSeleccionado.paradaAdicional,
      total: total,
    };

    await this.storageService.setItem('viajeConfirmado', viajeConfirmado); // Guardar el viaje en el almacenamiento

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
    this.paradaMarker = null; 
  }
}