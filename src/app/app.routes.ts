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
import { ChangeMyPwdComponent } from './change-my-pwd/change-my-pwd.component';

import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige vers /login par défaut
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardAdminComponent, canActivate: [authGuard] },
    { path: 'user', component: UtilisateursComponent, canActivate: [authGuard] },
    { path: 'historique', component: HistoriqueComponent, canActivate: [authGuard] },
    { path: 'inscription', component: AddUserComponent },
    { path: 'modification/:id', component: ModificationUtilisateurComponent },
    { path: 'dashboard-etudiant', component: DashboardEtudiantComponent, canActivate: [authGuard] },
    { path: 'forgot', component: ForgotPasswordComponent },
    { path: 'depot', component: DepotComponent, canActivate: [authGuard] },
    { path: 'vigile', component: DashboardVigileComponent, canActivate: [authGuard] },
    { path: 'vigile-resto', component: VigileRestoComponent, canActivate: [authGuard] },
    { path: 'change/:token', component: ChangePasswordComponent },
    { path: 'ModifierEtudiant', component: ModifierEtudiantComponent, canActivate: [authGuard] },
    { path: 'modif', component: ModifComponent },
    { path: 'modifprofile', component: EtudiantProfileComponent, canActivate: [authGuard] },
    { path: 'myaccount', component: ChangeMyPwdComponent },
    { path: '**', redirectTo: 'login' } // Redirige toutes les routes inconnues vers /login
  ];