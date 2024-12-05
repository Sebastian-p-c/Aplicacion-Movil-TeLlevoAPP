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

  formatRUT(value: string): void {
    const cleaned = value.replace(/[^\dkK]/g, '').toUpperCase();
    if (!cleaned) return;

    const formatted = cleaned
      .replace(/^(\d{1,2})(\d{3})(\d{3})([kK\d])$/, '$1.$2.$3-$4')
      .replace(/^(\d{1,2})(\d{3})(\d{3})$/, '$1.$2.$3');
    this.rut = formatted;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
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
      this.username.trim() !== '' &&
      this.rut.trim() !== '' &&
      this.fechaNacimiento !== '' &&
      !this.emailInvalid &&
      !this.passwordMismatch &&
      this.passwordRegistro.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    );
  }

  async crearCuenta() {
    if (this.isFormValid()) {
      const usuarios = (await this.storageService.getItem('usuarios')) || [];
      const lastUserId = (await this.storageService.getItem('lastUserId')) || 0;

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

      const nuevoUsuario = {
        id: lastUserId + 1,
        username: this.username,
        rut: this.rut,
        telefono: this.telefono,
        fechaNacimiento: this.fechaNacimiento,
        correoRegistro: this.correoRegistro,
        password: this.passwordRegistro,
      };

      usuarios.push(nuevoUsuario);

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
                state: { id: nuevoUsuario.id },
              };
              this.router.navigate(['/elegusuario'], navigationExtras);
            },
          },
        ],
        backdropDismiss: false,
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goBack() {
    this.router.navigate(['../']);
  }

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
