import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = '';  // Almacena la fecha confirmada
  fechaTemporal: string = '';    // Almacena temporalmente la fecha seleccionada
  mostrarCalendario: boolean = false;  // Controla si el calendario está visible o no

  constructor() { }

  ngOnInit() { }

  // Muestra el calendario cuando se hace clic en el input o ícono de fecha
  openCalendar() {
    this.mostrarCalendario = true;
  }

  // Cierra el calendario si el usuario cancela
  cancelCalendar() {
    this.mostrarCalendario = false;
    this.fechaTemporal = '';  // Limpiar la fecha temporal al cancelar
  }

  // Aplica la fecha seleccionada cuando el usuario presiona "Aplicar"
  applyDate() {
    if (this.fechaTemporal) {
      this.fechaNacimiento = this.fechaTemporal;  // Confirmar la fecha seleccionada
      this.mostrarCalendario = false;  // Ocultar el calendario
    }
  }
}
