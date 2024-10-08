import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  usernameRegistro: string = '';
  username: string = 'guest';

  constructor(
    private router: Router,  // Inyecta el Router para la navegación
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.username = state['user'];
    }
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    direction: 'horizontal',
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    spaceBetween: 10,
    centeredSlides: true,
  };

  // Función para cerrar sesión
  logout() {
    console.log('Cerrar sesión');
    // Aquí puedes limpiar el localStorage si es necesario
    // localStorage.removeItem('userToken');  // Ejemplo

    // Redirigir a la página principal
    this.router.navigate(['/home']);  // Redirige a la página principal
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.usernameRegistro = navigation.extras.state['usernameRegistro'];
    }
  }
}
