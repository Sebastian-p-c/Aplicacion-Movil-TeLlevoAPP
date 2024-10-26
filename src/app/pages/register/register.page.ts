import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { StorageService } from 'src/services/storage.service'; // Importa el servicio de almacenamiento

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
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService // Inyecta el servicio de almacenamiento
  ) { }

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
      // Verifica si ya existe un usuario registrado
      const existingUser = await this.storageService.getItem('userCredentials');

      // Si ya hay credenciales guardadas, verifica el nombre de usuario
      if (existingUser && existingUser.username === this.usernameRegistro) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El nombre de usuario ya está en uso.',
          buttons: ['OK'],
        });
        await alert.present();
        return; // Salir del método si el usuario ya existe
      }

      // Si no existe el usuario, guarda las credenciales
      await this.storageService.setItem('userCredentials', {
        username: this.usernameRegistro,
        password: this.passwordRegistro,
      });

      // Guarda datos adicionales
      await this.storageService.setItem('userData', {
        nombre: this.nombre,
        apellido: this.apellido,
        fechaNacimiento: this.fechaNacimiento,
        correoRegistro: this.correoRegistro,
        usernameRegistro: this.usernameRegistro,
      });

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha creado correctamente su cuenta',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              const navigationExtras: NavigationExtras = {
                state: {
                  usernameRegistro: this.usernameRegistro
                }
              };
              this.router.navigate(['/elegusuario'], navigationExtras);
            }
          }
        ],
        backdropDismiss: false
      });

      await alert.present();
    }
  }

  // Método para obtener los datos almacenados (si es necesario)
  async cargarDatos() {
    const userData = await this.storageService.getItem('userData');
    if (userData) {
      this.nombre = userData.nombre || '';
      this.apellido = userData.apellido || '';
      this.fechaNacimiento = userData.fechaNacimiento || '';
      this.correoRegistro = userData.correoRegistro || '';
      this.usernameRegistro = userData.usernameRegistro || '';
      this.passwordRegistro = userData.passwordRegistro || ''; // Cargar la contraseña, si es necesario
    }
  }
}


