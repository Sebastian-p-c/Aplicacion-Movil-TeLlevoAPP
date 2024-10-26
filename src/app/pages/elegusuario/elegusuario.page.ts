import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elegusuario',
  templateUrl: './elegusuario.page.html',
  styleUrls: ['./elegusuario.page.scss'],
})
export class ElegusuarioPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/home']);
  }

  navigateTo(role: string) {
    if (role === 'conductor') {
      this.router.navigate(['/conductor']);
    } else if (role === 'index') {
      this.router.navigate(['/index']);
    }
  }

}
