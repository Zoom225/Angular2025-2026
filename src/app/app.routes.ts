import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormationCatalogComponent } from './pages/formation-catalog/formation-catalog.component';
import { CreateFormationComponent } from './pages/create-formation/create-formation.component';
import { FormationDetailComponent } from './pages/formation-detail/formation-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: FormationCatalogComponent },
  { path: 'create', component: CreateFormationComponent },
  { path: 'formation/:id', component: FormationDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
