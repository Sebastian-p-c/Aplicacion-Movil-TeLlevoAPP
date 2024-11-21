import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa el almacenamiento.
   */
  async init() {
    if (!this._storage) {
      const storage = await this.storage.create();
      this._storage = storage;
    }
  }

  /**
   * Guarda un elemento en el almacenamiento.
   * @param key Clave del elemento a guardar.
   * @param value Valor a guardar.
   */
  async setItem(key: string, value: any) {
    if (!this._storage) {
      await this.init(); 
    }
    await this._storage?.set(key, value);
    console.log(`Elemento guardado [${key}]:`, value);
  }

  /**
   * Obtiene un elemento del almacenamiento.
   * @param key Clave del elemento a recuperar.
   * @returns El valor almacenado o `null` si no existe.
   */
  async getItem(key: string) {
    if (!this._storage) {
      await this.init(); 
    }
    const value = await this._storage?.get(key);
    console.log(`Elemento recuperado [${key}]:`, value);
    return value;
  }

  /**
   * Elimina un elemento del almacenamiento.
   * @param key Clave del elemento a eliminar.
   */
  async removeItem(key: string) {
    if (!this._storage) {
      await this.init(); 
    }
    await this._storage?.remove(key);
    console.log(`Elemento eliminado [${key}]`);
  }

  /**
   * Limpia todo el almacenamiento.
   */
  async clear() {
    if (!this._storage) {
      await this.init(); 
    }
    await this._storage?.clear();
    console.log('Todo el almacenamiento ha sido limpiado.');
  }
}
