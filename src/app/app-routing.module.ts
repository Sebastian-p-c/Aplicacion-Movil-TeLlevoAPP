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
];

@NgModule({
imports: [
RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
],
exports: [RouterModule]
})
export class AppRoutingModule { }
