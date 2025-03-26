import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { HistoriqueComponent } from './historique/historique.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ModificationUtilisateurComponent } from './modification-utilisateur/modification-utilisateur.component';
import { DashboardEtudiantComponent } from './dashboard-etudiant/dashboard-etudiant.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DepotComponent } from './depot/depot.component';
import { DashboardVigileComponent } from './dashboard-vigile/dashboard-vigile.component';
import { VigileRestoComponent } from './vigile-resto/vigile-resto.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModifierEtudiantComponent } from './modifier-etudiant/modifier-etudiant.component';
import { ModifComponent } from './modif/modif.component';
import { EtudiantProfileComponent } from './etudiant-profile/etudiant-profile.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige vers /login par défaut
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardAdminComponent },
    { path: 'user', component: UtilisateursComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: 'inscription', component: AddUserComponent },
    { path: 'modification/:id', component: ModificationUtilisateurComponent },
    { path: 'dashboard-etudiant', component: DashboardEtudiantComponent },
    { path: 'forgot', component: ForgotPasswordComponent },
    { path: 'depot', component: DepotComponent },
    { path: 'vigile', component: DashboardVigileComponent },
    { path: 'vigile-resto', component: VigileRestoComponent },
    { path: 'change/:token', component: ChangePasswordComponent },
    { path: 'ModifierEtudiant', component: ModifierEtudiantComponent },
    { path: 'modif', component: ModifComponent },
    { path: 'modifprofile', component: EtudiantProfileComponent },
    { path: '**', redirectTo: 'login' } // Redirige toutes les routes inconnues vers /login
  ];