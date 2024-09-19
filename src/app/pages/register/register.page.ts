import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = ''; 
  fechaTemporal: string = '';   
  mostrarCalendario: boolean = false;  

  correoRegistro: string = '';
  emailInvalid: boolean = false;

  usernameRegistro: string = '';

  passwordRegistro: string = '';
  confirmPassword: string = '';
  passwordVisible: boolean = false; 
  confirmPasswordVisible: boolean = false; 
  passwordMismatch: boolean = false; 

  constructor(
    private alertController: AlertController,  // Inyecta AlertController
    private router: Router) { }

  ngOnInit() { }

  openCalendar() {
    this.mostrarCalendario = true;
  }

  cancelCalendar() {
    this.mostrarCalendario = false;
    this.fechaTemporal = '';  
  }

  applyDate() {
    if (this.fechaTemporal) {
      this.fechaNacimiento = this.fechaTemporal;  
      this.mostrarCalendario = false;  
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  validatePasswords() {
    this.passwordMismatch = this.passwordRegistro !== this.confirmPassword;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailInvalid = !emailPattern.test(this.correoRegistro);
  }

  isFormValid(): boolean {
    return (
      this.nombre.trim() !== '' &&
      this.apellido.trim() !== '' &&
      this.fechaNacimiento !== '' &&
      !this.emailInvalid &&
      this.usernameRegistro.trim() !== '' &&
      !this.passwordMismatch &&
      this.passwordRegistro.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    );
  }
  

  async crearCuenta() {
    if (this.isFormValid()) {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha creado correctamente su cuenta',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // Pasar usernameRegistro al navegar a la página principal
              const navigationExtras: NavigationExtras = {
                state: {
                  usernameRegistro: this.usernameRegistro
                }
              };
              this.router.navigate(['/principal'], navigationExtras);
            }
          }
        ],
        backdropDismiss: false
      });

      await alert.present();
    }
  }
}
