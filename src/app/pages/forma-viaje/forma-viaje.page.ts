import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ViajeService } from 'src/services/viaje.service';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-forma-viaje',
  templateUrl: './forma-viaje.page.html',
  styleUrls: ['./forma-viaje.page.scss'],
})
export class FormaViajePage implements OnInit {
  // Datos del formulario
  origen: string = '';
  destino: string = '';
  suggestions: any[] = [];
  countrycode: string = '';
  origenCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };
  destinoCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };

  cantidad: number = 0;
  selectedBanco: string = '';
  selectedTipoCuenta: string = '';
  precioPasajero: number = 0;

  conductorData: any = {}; // Datos del conductor
  isLoading: boolean = false;

  private searchSubject: Subject<string> = new Subject(); // Para búsqueda en tiempo real

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.obtenerDatosConductor();
    this.setupSearchSubscription();
  }

  async obtenerDatosConductor() {
    const currentUserId = await this.storageService.getItem('currentUserId');
    const usuarios = (await this.storageService.getItem('usuarios')) || [];
    this.conductorData = usuarios.find((user: any) => user.id === currentUserId)?.datosConductor;

    if (!this.conductorData) {
      this.mostrarToast('No se encontraron datos del conductor. Por favor, regístrelos primero.');
    }
  }

  incrementarCantidad() {
    if (this.cantidad < 4) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 0) {
      this.cantidad--;
    }
  }

  async obtenerUbicacionActual() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
      spinner: 'crescent',
    });
    await loading.present();
    try {
      const ubicacion = await Geolocation.getCurrentPosition();
      const lat = ubicacion.coords.latitude;
      const lon = ubicacion.coords.longitude;

      this.origenCoords = { lat, lon };
      this.http.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: lat.toString(),
          lon: lon.toString(),
          format: 'json',
        },
      }).subscribe((response: any) => {
        const address = response.address;
        const shortAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || ''}`.trim();
        this.origen = shortAddress;
        this.countrycode = address.country_code ? address.country_code.toUpperCase() : '';
        this.mostrarToast(`Ubicación actual: ${shortAddress}`);
        loading.dismiss();
      }, error => {
        console.error('Error al obtener la dirección:', error);
        this.mostrarToast('No se pudo obtener la dirección actual.');
        loading.dismiss();
      });
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      this.mostrarToast('No se pudo obtener la ubicación.');
      loading.dismiss();
    }
  }

  setupSearchSubscription() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  onSearchChange(event: any) {
    const inputValue = event.target.value;
    if (inputValue) {
      this.destino = inputValue;
      this.searchSubject.next(this.destino);
    } else {
      this.suggestions = [];
    }
  }

  performSearch(query: string) {
    if (query && query.length > 2) {
      this.http.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: this.countrycode,
        },
      }).subscribe((response: any) => {
        this.suggestions = response.map((item: any) => {
          const { house_number, road, city, country } = item.address;
          return {
            display_name: `${road || ''} ${house_number || ''}, ${city || ''}, ${country || ''}`.trim(),
            lat: item.lat,
            lon: item.lon,
          };
        });
      }, error => {
        console.error('Error al obtener sugerencias:', error);
      });
    }
  }

  selectSuggestion(suggestion: any) {
    this.destino = suggestion.display_name;
    this.destinoCoords = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
    this.suggestions = [];
  }

  async generarViaje() {
    if (!this.origen || !this.destino || !this.conductorData) {
      this.mostrarToast('Por favor, completa todos los campos requeridos.');
      return;
    }

    const viaje = {
      origen: this.origen,
      destino: this.destino,
      origenCoords: this.origenCoords,
      destinoCoords: this.destinoCoords,
      conductor: {
        ...this.conductorData, // Incorporar datos del conductor
      },
      precioPasajero: this.precioPasajero,
      cantidadPasajeros: this.cantidad,
    };

    await this.viajeService.guardarViaje(viaje);

    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Viaje generado correctamente',
      buttons: ['OK'],
    });
    await alert.present();

    this.router.navigate(['/mapa'], {
      queryParams: {
        origenLat: this.origenCoords.lat,
        origenLon: this.origenCoords.lon,
        destinoLat: this.destinoCoords.lat,
        destinoLon: this.destinoCoords.lon,
      },
    });

    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.origen = '';
    this.destino = '';
    this.selectedBanco = '';
    this.selectedTipoCuenta = '';
    this.precioPasajero = 0;
    this.cantidad = 0;
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Realmente deseas salir?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Cerrar sesión');
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }
}
