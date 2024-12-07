import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-reg-conductor',
  templateUrl: './reg-conductor.page.html',
  styleUrls: ['./reg-conductor.page.scss'],
})
export class RegConductorPage {
  // Variables del formulario
  nombre: string = '';
  apellido: string = '';
  telefono: string = ''; // Inicializado correctamente
  matricula: string = '';
  modeloVehiculo: string = '';
  colorVehiculo: string = '';
  numeroCuenta: string = '';
  selectedBanco: string = '';
  selectedTipoCuenta: string = '';
  currentUserId: number | null = null; // Almacenar el ID del usuario logueado


  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  formatPhone(value: string): void {
    // Eliminar cualquier carácter no numérico
    const cleaned = value.replace(/\D/g, '');
    
    // Formatear en el estilo "x xxxx xxxx"
    const formatted = cleaned.replace(/^(\d{1})(\d{4})(\d{4})$/, '$1 $2 $3');
    
    this.telefono = formatted;
  }

  async ngOnInit() {
    // Recuperar el ID del usuario logueado desde el almacenamiento
    this.currentUserId = await this.storageService.getItem('currentUserId');
  
    if (this.currentUserId !== null) {
      console.log('Usuario logueado ID:', this.currentUserId);
  
      // Cargar datos del conductor si existen
      await this.cargarDatosConductor();
    } else {
      console.error('No se encontró un usuario logueado.');
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró un usuario logueado. Por favor, inicie sesión o registre una cuenta.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/home']); // Redirigir a la página de inicio o login
    }
  }

  // Método para cargar los datos del conductor
  async cargarDatosConductor() {
    const usuarios = await this.storageService.getItem('usuarios') || [];
    const usuario = usuarios.find((user: any) => user.id === this.currentUserId);
  
    if (usuario && usuario.datosConductor) {
      const datosConductor = usuario.datosConductor;
      this.nombre = datosConductor.nombre || ''; // Cargar nombre
      this.apellido = datosConductor.apellido || ''; // Cargar apellido
      this.telefono = datosConductor.telefono || 0; // Cargar teléfono
      this.matricula = datosConductor.matricula || '';
      this.modeloVehiculo = datosConductor.modeloVehiculo || '';
      this.colorVehiculo = datosConductor.colorVehiculo || '';
      this.selectedBanco = datosConductor.banco || '';
      this.selectedTipoCuenta = datosConductor.tipoCuenta || '';
      this.numeroCuenta = datosConductor.numeroCuenta || '';
    }
  }
  
  

  // Método que se ejecuta al cerrar el modal
  onDidDismiss(event: any, field: string) {
    const data = event.detail.data;
    if (field === 'banco' && data) {
      this.selectedBanco = data;
    } else if (field === 'tipoCuenta' && data) {
      this.selectedTipoCuenta = data;
    }
  }

  // Método que se ejecuta al seleccionar una opción en el picker
  onIonChange(event: any, field: string) {
    const value = event.detail.value;
    if (field === 'banco') {
      this.selectedBanco = value;
    } else if (field === 'tipoCuenta') {
      this.selectedTipoCuenta = value;
    }
  }

  async generarDatos() {
    if (!this.nombre || !this.apellido || !this.telefono || !this.matricula || !this.selectedBanco || !this.selectedTipoCuenta || !this.numeroCuenta) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    // Recuperar usuarios del Storage
    const usuarios = (await this.storageService.getItem('usuarios')) || [];
  
    // Buscar el usuario logueado por ID
    const usuario = usuarios.find((user: any) => user.id === this.currentUserId);
  
    if (!usuario) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró un usuario logueado. Por favor, registre o inicie sesión nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    // Actualizar los datos del conductor
    usuario.datosConductor = {
      nombre: this.nombre, // Agregar nombre
      apellido: this.apellido, // Agregar apellido
      telefono: this.telefono, // Agregar teléfono
      matricula: this.matricula,
      modeloVehiculo: this.modeloVehiculo,
      colorVehiculo: this.colorVehiculo,
      banco: this.selectedBanco,
      tipoCuenta: this.selectedTipoCuenta,
      numeroCuenta: this.numeroCuenta,
    };
  
    // Guardar los usuarios actualizados en el Storage
    await this.storageService.setItem('usuarios', usuarios);

    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Datos del conductor registrados correctamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/conductor']);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  // Método para confirmar y procesar la acción de logout
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
          handler: async () => {
            await this.storageService.removeItem('currentUserId'); // Limpiar el usuario logueado
            console.log('Cerrar sesión');
            this.router.navigate(['/home']); // Redirigir a la página de inicio
          },
        },
      ],
    });

    await alert.present();
  }
}
