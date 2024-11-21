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
  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = ''; 
  fechaTemporal: string = '';   
  mostrarCalendario: boolean = false;  

  correoRegistro: string = '';
  emailInvalid: boolean = false;

  passwordRegistro: string = '';
  confirmPassword: string = '';
  passwordVisible: boolean = false; 
  confirmPasswordVisible: boolean = false; 
  passwordMismatch: boolean = false; 

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storageService: StorageService
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
      !this.passwordMismatch &&
      this.passwordRegistro.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    );
  }

  async crearCuenta() {
    if (this.isFormValid()) {
      // Obtener la lista de usuarios existente o inicializarla como un array vacío
      const usuarios = await this.storageService.getItem('usuarios') || [];
  
      // Verificar si el nombre ya está en uso
      const existingUser = usuarios.find((user: any) => user.nombre === this.nombre);
  
      if (existingUser) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El nombre ya está en uso.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
  
      // Crear un nuevo objeto de usuario y agregarlo a la lista de usuarios
      const nuevoUsuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        fechaNacimiento: this.fechaNacimiento,
        correoRegistro: this.correoRegistro,
        password: this.passwordRegistro,
      };
      usuarios.push(nuevoUsuario);
  
      // Guardar la lista actualizada de usuarios en el Storage
      await this.storageService.setItem('usuarios', usuarios);
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha creado correctamente su cuenta',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              const navigationExtras: NavigationExtras = {
                state: {
                  nombre: this.nombre
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

  async cargarDatos(nombre: string) {
    const usuarios = await this.storageService.getItem('usuarios');
    console.log('Usuarios recuperados:', usuarios); // Verifica qué datos se están recuperando
  
    if (usuarios) {
      const userData = usuarios.find((user: any) => user.nombre === nombre);
      console.log('Usuario encontrado:', userData); // Verifica si encuentra al usuario con el nombre proporcionado
      if (userData) {
        this.nombre = userData.nombre || '';
        this.apellido = userData.apellido || '';
        this.fechaNacimiento = userData.fechaNacimiento || '';
        this.correoRegistro = userData.correoRegistro || '';
        this.passwordRegistro = userData.password || '';
      }
    }
  }
}