import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajeService } from 'src/services/viaje.service';

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
    private viajeService: ViajeService,
    private alertController: AlertController
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

    await this.viajeService.guardarViaje(viaje);

    const viajesGuardados = await this.viajeService.obtenerViajes();
    console.log('Viajes guardados:', viajesGuardados);

    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Viaje generado correctamente',
      buttons: ['OK'],
    });

    await alert.present();

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
}


