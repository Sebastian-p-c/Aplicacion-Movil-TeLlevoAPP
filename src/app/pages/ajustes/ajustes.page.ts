import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage {
  isHighContrast = false;
  fontSize = 'medium';

  constructor(private router: Router) {}

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast', this.isHighContrast);
  }

  changeFontSize(event: any) {
    document.body.style.fontSize = this.fontSize === 'large' ? '1.2em' : this.fontSize === 'small' ? '0.9em' : '1em';
  }

  logout() {
    // Redirige a la página de inicio de sesión o realiza la acción de cierre de sesión
    this.router.navigate(['/home']); // Cambia '/home' a la ruta deseada después del cierre de sesión
  }
}
