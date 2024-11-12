import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
  origen: string = '';
  destino: string = '';
  suggestions: any[] = [];
  countrycode: string = '';
  private searchSubject: Subject<string> = new Subject();

  origenCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };
  destinoCoords: { lat: number; lon: number } = { lat: 0, lon: 0 };

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.obtenerUbicacionActual();
    this.setupSearchSubscription();
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
      this.destino = this.capitalizeFirstLetter(inputValue);
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
            display_name: `${road || ''} ${house_number || ''}, ${city || ''}, ${country || ''}`
              .replace(/, ,/g, ',')
              .replace(/^, |, $/g, '')
              .trim(),
            lat: item.lat,
            lon: item.lon,
            hasHouseNumber: !!house_number
          };
        });
      }, error => {
        console.error("Error al obtener sugerencias:", error);
      });
    }
  }

  selectSuggestion(suggestion: any) {
    if (!suggestion.hasHouseNumber) {
      this.mostrarToast("Número de casa no disponible. Por favor, ingrese manualmente.");
    }
    this.destino = suggestion.display_name;
    this.destinoCoords = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
    this.suggestions = [];
  }

  capitalizeFirstLetter(text: string): string {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
    });
    await toast.present();
  }

  confirmarViaje() {
    console.log("Botón Confirmar Viaje presionado");
    
    if (this.destinoCoords.lat === 0 && this.destinoCoords.lon === 0) {
      this.mostrarToast("Por favor, selecciona un destino válido.");
      return;
    }
  
    this.router.navigate(['/mapa'], {
      queryParams: {
        origenLat: this.origenCoords.lat,
        origenLon: this.origenCoords.lon,
        destinoLat: this.destinoCoords.lat,
        destinoLon: this.destinoCoords.lon
      }
    });
  }
  

  goBack() {
    this.navCtrl.back();
  }
}
