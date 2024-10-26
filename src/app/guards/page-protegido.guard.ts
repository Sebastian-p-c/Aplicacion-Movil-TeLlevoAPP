import { CanActivateFn } from '@angular/router';

export const pageProtegidoGuard: CanActivateFn = (route, state) => {
  return true;
};
