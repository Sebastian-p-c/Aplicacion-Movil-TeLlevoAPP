import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Campos del formulario de registro
  username: string = '';
  rut: string = '';
  fechaNacimiento: string = '';
  fechaTemporal: string = '';
  mostrarCalendario: boolean = false;
  telefono: string = '';
  correoRegistro: string = '';
  passwordRegistro: string = '';
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  emailInvalid: boolean = false;
  passwordMismatch: boolean = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  // Métodos para el manejo del calendario
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

  // Métodos para la visibilidad de contraseñas
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Validaciones del formulario
  validatePasswords() {
    this.passwordMismatch = this.passwordRegistro !== this.confirmPassword;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailInvalid = !emailPattern.test(this.correoRegistro);
  }

  isFormValid(): boolean {
    return (
      this.username.trim() !== '' &&
      this.rut.trim() !== '' &&
      this.telefono.trim() !== '' &&
      this.fechaNacimiento !== '' &&
      !this.emailInvalid &&
      !this.passwordMismatch &&
      this.passwordRegistro.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    );
  }

  // Crear una nueva cuenta de usuario
  async crearCuenta() {
    if (this.isFormValid()) {
      const usuarios = (await this.storageService.getItem('usuarios')) || [];
      const lastUserId = (await this.storageService.getItem('lastUserId')) || 0; // Obtener el último ID generado

      // Verificar si el RUT ya existe
      const existingUser = usuarios.find((user: any) => user.rut === this.rut);

      if (existingUser) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El RUT ya está registrado.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }

      // Crear un nuevo usuario con un ID único
      const nuevoUsuario = {
        id: lastUserId + 1, // Incrementar el ID
        username: this.username,
        rut: this.rut,
        telefono: this.telefono,
        fechaNacimiento: this.fechaNacimiento,
        correoRegistro: this.correoRegistro,
        password: this.passwordRegistro,
      };

      usuarios.push(nuevoUsuario);

      // Actualizar el último ID y guardar los usuarios
      await this.storageService.setItem('lastUserId', nuevoUsuario.id);
      await this.storageService.setItem('usuarios', usuarios);
      await this.storageService.setItem('currentUserId', nuevoUsuario.id);

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha creado correctamente su cuenta.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              const navigationExtras: NavigationExtras = {
                state: {
                  id: nuevoUsuario.id, // Navegar utilizando el ID
                },
              };
              this.router.navigate(['/elegusuario'], navigationExtras);
            },
          },
        ],
        backdropDismiss: false,
      });

      await alert.present();
    }
  }
  goBack() {
    window.history.back(); // Navegar a la página anterior
  }
  
  // Método para cargar datos del usuario según el ID
  async cargarDatos(id: number) {
    const usuarios = await this.storageService.getItem('usuarios');

    if (usuarios) {
      const userData = usuarios.find((user: any) => user.id === id);
      if (userData) {
        this.username = userData.username || '';
        this.rut = userData.rut || '';
        this.telefono = userData.telefono || '';
        this.fechaNacimiento = userData.fechaNacimiento || '';
        this.correoRegistro = userData.correoRegistro || '';
        this.passwordRegistro = userData.password || '';
      }
    }
  }
}
