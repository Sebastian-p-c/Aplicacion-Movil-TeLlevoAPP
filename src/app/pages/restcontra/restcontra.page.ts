import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-restcontra',
  templateUrl: './restcontra.page.html',
  styleUrls: ['./restcontra.page.scss'],
})
export class RestcontraPage implements OnInit {
  correo: string = '';
  nuevaPassword: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  emailInvalid: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  async onSubmit() {
    // Validar email y contraseñas
    this.validateEmail();
    this.validatePasswords();

    if (this.emailInvalid || this.passwordMismatch) {
      return;
    }

    // Recuperar lista de usuarios del almacenamiento
    const usuarios = (await this.storageService.getItem('usuarios')) || [];
    const usuario = usuarios.find((user: any) => user.correoRegistro === this.correo);

    if (!usuario) {
      await this.presentErrorAlert('El correo ingresado no está registrado.');
      return;
    }

    // Actualizar la contraseña del usuario encontrado
    usuario.password = this.nuevaPassword;
    await this.storageService.setItem('usuarios', usuarios);

    await this.presentSuccessAlert();
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailInvalid = !emailPattern.test(this.correo);
  }

  validatePasswords() {
    this.passwordMismatch = this.nuevaPassword !== this.confirmPassword;
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Se ha restablecido tu contraseña correctamente.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  goBack() {
    window.history.back(); // Navegar a la página anterior
  }
  
}
