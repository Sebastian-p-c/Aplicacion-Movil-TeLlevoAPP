import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajeService } from 'src/services/viaje.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-forma-viaje',
  templateUrl: './forma-viaje.page.html',
  styleUrls: ['./forma-viaje.page.scss'],
})
export class FormaViajePage implements OnInit {
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
    private viajeService: ViajeService, // Inyecta el servicio
    private alertController: AlertController // Para mostrar alertas
  ) { }

  ngOnInit() { }

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

  async generarViaje() {
    const viaje = {
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

    // Guarda el viaje en el almacenamiento
    await this.viajeService.guardarViaje(viaje);

    // Verificar que el viaje se ha guardado
    const viajesGuardados = await this.viajeService.obtenerViajes();
    console.log('Viajes guardados:', viajesGuardados); // Para depurar

    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Viaje generado correctamente',
      buttons: ['OK'],
    });

    await alert.present();

    // Limpiar el formulario después de guardar
    this.limpiarFormulario();
  }

  limpiarFormulario() {
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
    // Aquí puedes limpiar el localStorage si es necesario
    // localStorage.removeItem('userToken');  // Ejemplo

    // Redirigir a la página principal
    this.router.navigate(['/home']);  // Redirige a la página principal
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
}


