import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elegusuario',
  templateUrl: './elegusuario.page.html',
  styleUrls: ['./elegusuario.page.scss'],
})
export class ElegusuarioPage implements OnInit {
  usernameRegistro: string = ''; 

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.usernameRegistro = navigation.extras.state['usernameRegistro'];
    }
  }

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/home']);
  }

  navigateTo(role: string) {
    if (role === 'conductor') {
      this.router.navigate(['/conductor'], { state: { usernameRegistro: this.usernameRegistro } });
    } else if (role === 'index') {
      this.router.navigate(['/index'], { state: { usernameRegistro: this.usernameRegistro } });
    }
  }
}

