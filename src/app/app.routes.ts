import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ModificationUtilisateurComponent } from './modification-utilisateur/modification-utilisateur.component';
import { DashboardEtudiantComponent } from './dashboard-etudiant/dashboard-etudiant.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige vers /login par défaut
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardAdminComponent },
    { path: 'user', component: UtilisateursComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: 'inscription', component: AddUserComponent },
    { path: 'modification/:id', component: ModificationUtilisateurComponent },
    { path: 'dashboard-etudiant', component: DashboardEtudiantComponent },
    { path: '**', redirectTo: 'login' } // Redirige toutes les routes inconnues vers /login
  ];