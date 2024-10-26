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

  async init() {
    // Inicializa el almacenamiento
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async setItem(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async getItem(key: string) {
    return await this._storage?.get(key);
  }

  async removeItem(key: string) {
    await this._storage?.remove(key);
  }

  async clear() {
    await this._storage?.clear();
  }
}
