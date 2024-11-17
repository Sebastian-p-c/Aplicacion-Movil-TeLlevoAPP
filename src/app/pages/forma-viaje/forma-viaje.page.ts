import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ViajeService } from 'src/services/viaje.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-forma-viaje',
  templateUrl: './forma-viaje.page.html',
  styleUrls: ['./forma-viaje.page.scss'],
})
export class FormaViajePage implements OnInit {
  origen: string = '';
  destino: string = '';
  suggestions: any[] = [];
  countrycode: string = '';
  private searchSubject: Subject<string> = new Subject();
  origenCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };
  destinoCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };

  cantidad: number = 0;
  selectedBanco: string = '';
  selectedTipoCuenta: string = '';
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  matricula: string = '';
  modeloVehiculo: string = '';
  colorVehiculo: string = '';
  telefonoContacto: string = '';
  numeroCuenta: string = '';
  precioPasajero: number = 0;

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.setupSearchSubscription();
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
        }
      }).subscribe((response: any) => {
        const address = response.address;
        const shortAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || ''}`.trim();
        this.origen = shortAddress;        
        this.countrycode = address.country_code ? address.country_code.toUpperCase() : '';
        this.mostrarToast(`Ubicación actual: ${shortAddress}`);
      }, error => {
        console.error("Error al obtener la dirección:", error);
        this.mostrarToast("No se pudo obtener la dirección actual.");
      });
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      this.mostrarToast("No se pudo obtener la ubicación.");
    }
  }
  

  async generarViaje() {
    if (this.destinoCoords.lat === 0 && this.destinoCoords.lon === 0) {
      this.mostrarToast("Por favor, selecciona un destino válido.");
      return;
    }
    const viaje = {
      origen: this.origen,
      destino: this.destino,
      origenCoords: this.origenCoords,
      destinoCoords: this.destinoCoords,
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
      matricula: this.matricula,
      modeloVehiculo: this.modeloVehiculo,
      colorVehiculo: this.colorVehiculo,
      telefonoContacto: this.telefonoContacto,
      banco: this.selectedBanco,
      tipoCuenta: this.selectedTipoCuenta,
      numeroCuenta: this.numeroCuenta,
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
        destinoLon: this.destinoCoords.lon
      }
    });
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.origen = '';
    this.destino = '';
    this.nombre = '';
    this.apellido = '';
    this.rut = '';
    this.matricula = '';
    this.modeloVehiculo = '';
    this.colorVehiculo = '';
    this.telefonoContacto = '';
    this.selectedBanco = '';
    this.selectedTipoCuenta = '';
    this.numeroCuenta = '';
    this.precioPasajero = 0;
    this.cantidad = 0;
  }

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/home']);
  }

  onIonChange(event: CustomEvent, field: string) {
    if (field === 'banco') {
      this.selectedBanco = event.detail.value;
    } else if (field === 'tipoCuenta') {
      this.selectedTipoCuenta = event.detail.value;
    }
  }

  onDidDismiss(event: CustomEvent, field: string) {
    if (event.detail.role === 'confirm') {
      if (field === 'banco') {
        this.selectedBanco = event.detail.data;
      } else if (field === 'tipoCuenta') {
        this.selectedTipoCuenta = event.detail.data;
      }
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
          countrycodes: this.countrycode
        }
      }).subscribe((response: any) => {
        this.suggestions = response.map((item: any) => {
          const { house_number, road, city, country } = item.address;
          return {
            display_name: `${road || ''} ${house_number || ''}, ${city || ''}, ${country || ''}`.trim(),
            lat: item.lat,
            lon: item.lon
          };
        });
      }, error => {
        console.error("Error al obtener sugerencias:", error);
      });
    }
  }

  selectSuggestion(suggestion: any) {
    this.destino = suggestion.display_name;
    this.destinoCoords = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
    this.suggestions = [];
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
    });
    await toast.present();
  }   
}


