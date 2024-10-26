import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  isHighContrast = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedContrast = localStorage.getItem('high-contrast');
    if (storedContrast === 'true') {
      this.isHighContrast = true;
      document.body.classList.add('high-contrast');
    }
  }

  toggleHighContrast(event: any) {
    const isHighContrast = event.detail.checked;
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
      localStorage.setItem('high-contrast', 'true');
    } else {
      document.body.classList.remove('high-contrast');
      localStorage.setItem('high-contrast', 'false');
    }
  }
  

  logout() {
    this.router.navigate(['/home']);
  }
}
