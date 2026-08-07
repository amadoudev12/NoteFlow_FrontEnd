import React from 'react'
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './Private.Route.jsx'
import PageLoader from '../components/LoaderPage.jsx'



const LoginPage = lazy(()=> import('../pages/login.jsx'))
const FirstLoginPage = lazy(()=> import('../pages/FirstLogin.jsx'))
const DashboardEnseignant = lazy(()=> import('../pages/enseignant-dashboard.jsx'))
const ListeEleve = lazy(()=>import('../pages/listEtudiants.jsx'))
const DashLayout = lazy(()=>import('../layouts/dashLayout.jsx'))
const Classes = lazy(()=>import('../pages/Classes.jsx'))
const Home = lazy(()=> import('../pages/home.jsx'))
const EleveDashboard = lazy(()=>import('../pages/eleve-dashboard.jsx'))
const AdminDashboard = lazy(()=> import('../pages/Admin.jsx'))
const AdminSideBar = lazy(()=> import('../layouts/AdminLayout.jsx'))
// const Trimestre = lazy(()=> import('../pages/Trimestre.jsx'))
const FaireAppel = lazy(()=> import('../pages/FaireAppel.jsx'))
const Etablissement = lazy(()=> import('../pages/Etablissement.jsx'))
const Bulletins = lazy(()=> import('../pages/Bulletin.jsx'))
const TopClasse = lazy(()=> import('../pages/MeilleurEleves.jsx'))
const BadEleves = lazy(()=> import('../pages/MauvaisEleves.jsx'))
const PostMatiereOrClasse = lazy(()=> import('../pages/MatieresClasses.jsx'))
const Affectation = lazy(()=> import('../pages/Affectations.jsx'))
const Import = lazy(()=> import ('../pages/Import.jsx'))
const Register = lazy(()=> import('../pages/Register.jsx'))
const Error500  = lazy(()=> import('../pages/Erreur500.jsx'))
const NotesPage = lazy(()=>import('../pages/NotesPages.jsx'))
const StatistiquesPages = lazy(()=> import('../pages/ClassesStat.jsx'))
const StatistiquesClassePages = lazy(()=>import('../pages/StatistiquesClasse.jsx'))
const MesAbsences = lazy(()=> import('../pages/MesAbsences.jsx'))
const SUPERADMIN  = lazy(()=> import('../pages/SuperAdmin.jsx'))
const SuperAdminDashboard = lazy(()=> import('../pages/super-admin/DashboardPage.jsx'))
const SuperAdminEtablissements = lazy(()=> import('../pages/super-admin/EtablissementsPage.jsx'))
const SuperAdminDirecteurs = lazy(()=> import('../pages/super-admin/DirecteursPage.jsx'))
const SuperAdminAnnees = lazy(()=> import('../pages/super-admin/AnneesPage.jsx'))
const SuperAdminTrimestres = lazy(()=> import('../pages/super-admin/TrimestresPage.jsx'))
const SuperAdminStatistiques = lazy(()=> import('../pages/super-admin/StatistiquesPage.jsx'))
const SuperAdminLogs = lazy(()=> import('../pages/super-admin/LogsPage.jsx'))
const SuperAdminParametres = lazy(()=> import('../pages/super-admin/ParametresPage.jsx'))
export default function Approutes() {
return (
    <Suspense fallback={<PageLoader message={"chargement"}/>}>
        <Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/' element={<Home/>}/>
            
            <Route path="/500" element={<Error500 />} />
            <Route element={<PrivateRoute/>}>
                <Route path='/modification' element={<FirstLoginPage/>} />
                {/* enseignant route  */}
                    <Route path='/dashboard/enseignant' element={<DashboardEnseignant/>}/>
                    <Route path='/dashboard/classes' element={<Classes/>}/>
                    <Route path='/dashboard/eleves' element={<Classes/>}/>
                    <Route path='/dashboard/notes' element={<Classes/>}/>
                    <Route path='/dashboard/liste-eleve/:id' element={<ListeEleve/>}/>
                    <Route path="/dashboard/notes/:id_classe" element={<NotesPage />} />
                    <Route path="/dashboard/FaireAppel" element={<FaireAppel />} />
                {/* Admin route */}
                <Route element={<AdminSideBar/>}>
                    <Route path='/dashboard/admin' element={<AdminDashboard/>}/>
                    <Route path='/dashboard-admin/liste-eleve/:id' element={<ListeEleve/>}/>
                    {/* <Route path='/dashboard/admin/trimestre' element={<Trimestre/>}/> */}
                    <Route path='/dashboard/admin/etablissement' element={<Etablissement/>}/>
                    <Route path='/dashboard/bulletins' element={<Bulletins/>}/>
                    <Route path='/dashboard/admin/meilleur-eleves' element={<TopClasse/>}/>
                    <Route path='/dashboard/admin/mauvais-eleves' element={<BadEleves/>}/>
                    <Route path='/dashboard/admin/matieres' element={<PostMatiereOrClasse/>}/>
                    <Route path='/dashboard/admin/classes' element={<PostMatiereOrClasse/>}/>
                    <Route path='/dashboard/admin/affectation' element={<Affectation/>}/>
                    <Route path='/dashboard/admin/import' element={<Import/>}/>
                    <Route path='/dashboard/admin/statistique' element={<StatistiquesPages/>}/>
                    <Route path='/dashboard/admin/statistique/classe/:classeId' element={<StatistiquesClassePages/>}/>
                </Route>
                <Route path='/dashboard/eleve' element={<EleveDashboard/>}/>
                <Route path='/dashboard/eleve/mes-absences' element={<MesAbsences/>}/>
                <Route path='/dashboard/super-admin' element={<SUPERADMIN/>}>
                    <Route index element={<SuperAdminDashboard/>}/>
                    <Route path='etablissements' element={<SuperAdminEtablissements/>}/>
                    <Route path='directeurs' element={<SuperAdminDirecteurs/>}/>
                    <Route path='annees' element={<SuperAdminAnnees/>}/>
                    <Route path='trimestres' element={<SuperAdminTrimestres/>}/>
                    <Route path='statistiques' element={<SuperAdminStatistiques/>}/>
                    <Route path='logs' element={<SuperAdminLogs/>}/>
                    <Route path='parametres' element={<SuperAdminParametres/>}/>
                    <Route path='register/etablissement' element={<Register/>}/>
                </Route>

            </Route>
        </Routes>
    </Suspense>
)
}