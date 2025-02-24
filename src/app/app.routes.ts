import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AddUserComponent } from './add-user/add-user.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige vers /login par défaut
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardAdminComponent },
    { path: 'user', component: UtilisateursComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: 'inscription', component: AddUserComponent },
    { path: '**', redirectTo: 'login' } // Redirige toutes les routes inconnues vers /login
  ];