import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { pageProtegidoGuard } from './guards/page-protegido.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/index/index.module').then(m => m.IndexPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },

  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then(m => m.PrincipalPageModule)
  },
  {
    path: 'restcontra',
    loadChildren: () => import('./pages/restcontra/restcontra.module').then(m => m.RestcontraPageModule)
  },
  {
    path: 'elegusuario',
    loadChildren: () => import('./pages/elegusuario/elegusuario.module').then(m => m.ElegusuarioPageModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./pages/conductor/conductor.module').then(m => m.ConductorPageModule),
    canActivate: [pageProtegidoGuard]
  },
  {
    path: 'forma-viaje',
    loadChildren: () => import('./pages/forma-viaje/forma-viaje.module').then(m => m.FormaViajePageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'ajustes',  // Ruta para la página de ajustes
    loadChildren: () => import('./pages/ajustes/ajustes.module').then(m => m.AjustesPageModule)
  },
  // Ruta de página no encontrada, debe estar al final
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
