import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Revisa si el modo alto contraste está activado en localStorage al iniciar la app
    const storedContrast = localStorage.getItem('high-contrast');
    if (storedContrast === 'true') {
      document.body.classList.add('high-contrast');
    }
  }
}
