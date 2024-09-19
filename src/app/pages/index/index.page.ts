import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})

export class IndexPage implements OnInit {

  username: string = 'guest';
  constructor(
    private router: Router,
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state
    if(state){
      this.username = state['user']
    }
  }

  slideOpts = {
    initialSlide: 0,     // Empieza en la primera imagen
    speed: 400,          // Velocidad de transición de 400 ms
    autoplay: {
      delay: 3000,       // Cambia de slide cada 3 segundos
      disableOnInteraction: false, // El autoplay sigue incluso después de la interacción
    },
    loop: true,          // El carrusel vuelve a empezar cuando llega al final
    direction: 'horizontal',  // Configuración para desplazamiento horizontal (predeterminado)
    pagination: {
      el: '.swiper-pagination', // Muestra los puntos de paginación abajo
      clickable: true,  // Permite hacer clic en los puntos de paginación
    },
    spaceBetween: 10,  // Espacio entre las slides
    centeredSlides: true,  // Centra las slides en la vista
  };

  logout() {
    console.log('Cerrar sesión'); // Aquí puedes agregar la lógica de cierre de sesión
    // Por ejemplo, navegar a la página de login o realizar alguna acción de logout
  }



  ngOnInit() {
  }

}
