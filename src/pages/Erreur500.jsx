import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Error500() {
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role;

      if (role === "ENSEIGNANT") {
        navigate("/dashboard/enseignant");
      } else if (role === "ELEVE") {
        navigate("/dashboard/eleve");
      } else {
        navigate("/dashboard/admin");
      }
    } catch (error) {
      console.error("Impossible de décoder le token", error);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 text-white px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-extrabold text-red-500">500</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Erreur interne du serveur
        </h2>

        <p className="mt-2 text-slate-300">
          Oups quelque chose s’est mal passé de notre côté.
          Réessaie plus tard ou retourne au tableau de bord.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            Réessayer
          </button>

          <button
            onClick={handleGoDashboard}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}
