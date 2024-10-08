import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importa Router para redirigir

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usernameRegistro: string = '';  // Usuario logueado

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.usernameRegistro = navigation.extras.state['usernameRegistro'];  // Obtener nombre de usuario
    }
  }

  // Función para cerrar sesión
  cerrarSesion() {
    // Aquí puedes limpiar los datos del usuario si es necesario (por ejemplo, tokens de autenticación)
    console.log('Sesión cerrada');
    
    // Redirigir a la página principal o login
    this.router.navigate(['/login']);  // Redirige a la página de login o inicio
  }
}
