import { useState } from 'react';
import userService from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import PageLoader from './LoaderPage';


// ── Composant principal ─────────────────────────────────────────
export default function LoginComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin]               = useState('');
  const [mot_passe, setMot_passe]       = useState('');
  const [loading, setLoading]           = useState(false);  // ← nouveau
  const [error, setError]               = useState(null);   // ← nouveau

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!login || !mot_passe) {
      setError('Veuillez renseigner tous les champs.');
      return;
    }

    setLoading(true);   // ← loader s'affiche
    setError(null);

    try {
      const res = await userService.loginUser({ login, mot_passe });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        const token = jwtDecode(res.data.token);
        const role = token.user?.user?.role || token.user?.role || token.role;
        const firstLogin = token.user?.user?.firstLogin ?? token.user?.firstLogin ?? token.firstLogin;

        if (firstLogin && role === 'ENSEIGNANT') {
          localStorage.setItem('role', role);
          navigate('/modification');
          return;
        }

        if (role === 'ENSEIGNANT') {
          localStorage.setItem('role', role);
          navigate('/dashboard/enseignant');
        } else if (role === 'ELEVE') {
          localStorage.setItem('role', role);
          navigate('/dashboard/eleve');
        } else if (role === 'SUPERADMIN' || role === 'SUPER_ADMIN') {
          localStorage.setItem('role', role);
          navigate('/dashboard/super-admin');
        } else if(role === "ADMIN") {
          localStorage.setItem('role', role || 'ADMIN');
          navigate('/dashboard/admin');
        }else {
          navigate('/login')
        }
      }
    } catch (err) {
      setError('Identifiants incorrects, veuillez réessayer.');
    } finally {
      setLoading(false); // ← loader disparaît toujours
    }
  };

  return (
    <>
      {/* Loader pleine page au clic */}
      {loading && <PageLoader message={"connexion en cours"} />}

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
              <p className="mt-2 text-sm text-gray-600">Accédez à votre compte</p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">

              {/* Login */}
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                  Login
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="login"
                    name="login"
                    type="text"
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-150 ease-in-out disabled:opacity-50"
                    placeholder="XXX-XX"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setMot_passe(e.target.value)}
                    required
                    disabled={loading}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-150 ease-in-out disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>

            </form>
          </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              pas de compte ?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                S'inscrire
              </button>
            </p>
        </div>
      </div>
    </>
  );
}