import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importa Router

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usernameRegistro: string = '';  // Usamos usernameRegistro en lugar de nombreUsuario

  constructor(private router: Router) { }

  ngOnInit() {
    // Recupera el usernameRegistro desde la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.usernameRegistro = navigation.extras.state['usernameRegistro'];  // Recupera el valor del estado
    }
  }
}
