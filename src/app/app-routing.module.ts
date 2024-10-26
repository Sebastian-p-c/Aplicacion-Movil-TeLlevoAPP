import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
path: 'home',
loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
},
{
path: '',
redirectTo: 'home',
pathMatch: 'full'
},
{
path: 'index',
loadChildren: () => import('./pages/index/index.module').then( m => m.IndexPageModule)
},
{
path: 'register',
loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
},
{
path: 'store',
loadChildren: () => import('./pages/store/store.module').then( m => m.StorePageModule)
},

  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'restcontra',
    loadChildren: () => import('./pages/restcontra/restcontra.module').then( m => m.RestcontraPageModule)
  },
  {
    path: 'elegusuario',
    loadChildren: () => import('./pages/elegusuario/elegusuario.module').then( m => m.ElegusuarioPageModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./pages/conductor/conductor.module').then( m => m.ConductorPageModule)
  },
  {
    path: 'forma-viaje',
    loadChildren: () => import('./pages/forma-viaje/forma-viaje.module').then( m => m.FormaViajePageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },



// Esto de abajo debe estar al ultimo siempre, despues de cada path, ya que es el page not found, de lo contrario genera errores
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
