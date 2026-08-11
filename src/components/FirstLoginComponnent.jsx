import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap,
  CheckCircle2,
  Eye,
  EyeOff,
  PenTool,
  Eraser,
  Loader2,
  ShieldAlert,
} from "lucide-react";


// ZOD SCHEMA


const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });


// COMPOSANT


export default function FirstLoginComponent({
  userName,
  user,
  onFormDataReady,
  onCompleted,
}) {
  const signatureRequise = ["ENSEIGNANT", "ADMIN"].includes(user?.role);
  const sigRef = useRef();

  const [step, setStep] = useState(1);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });


  // ETAPES


  const totalStep = signatureRequise ? 2 : 1;
  const progress = Math.round((step / totalStep) * 100);

  // PASSER A SIGNATURE
  const nextStep = async () => {
    const valid = await trigger(["password", "confirmPassword"]);
    if (!valid) return;

    if (signatureRequise) {
      setStep(2);
    } else {
      document.querySelector("form")?.requestSubmit();
    }
  };


  // SIGNATURE
  const signatureEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setHasSignature(true);
      setSignatureError("");
    }
  };

  const clearSignature = () => {
    sigRef.current?.clear();
    setHasSignature(false);
  };


  // SUBMIT

  const submit = async (values) => {
    if (signatureRequise && !hasSignature) {
      setSignatureError("Veuillez ajouter votre signature");
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      const formData = new FormData();
      formData.append("password", values.password);

      if (signatureRequise) {
        const blob = await new Promise((resolve) => {
          sigRef.current.getCanvas().toBlob(resolve, "image/png");
        });
        formData.append("signature", blob, "signature.png");
      }

      const destination = await onFormDataReady(formData);
      setSuccess(true);
      // The token has already been refreshed and completion confirmed here.
      setTimeout(() => onCompleted(destination), 700);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || "Impossible de terminer la configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          {/* En-tête */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-bold text-xl mt-3 text-blue-950">
              Bienvenue {userName}
            </h2>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <p className="font-bold text-slate-800">Configuration terminée</p>
              <p className="text-sm text-slate-500 mt-1">
                Redirection vers votre espace…
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Première connexion obligatoire</span>
              </div>

              {/* Barre de progression */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-xs font-semibold text-blue-900/70 uppercase tracking-wide">
                    Étape {step}/{totalStep}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">{progress}%</p>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit(submit)}>
                {submitError && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-blue-900/80 block mb-1.5">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          className="w-full border border-blue-200 rounded-lg p-3 pr-11 bg-blue-50/40 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4.5 h-4.5" />
                          ) : (
                            <Eye className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-blue-900/80 block mb-1.5">
                        Confirmation
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          {...register("confirmPassword")}
                          className="w-full border border-blue-200 rounded-lg p-3 pr-11 bg-blue-50/40 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                          tabIndex={-1}
                        >
                          {showConfirm ? (
                            <EyeOff className="w-4.5 h-4.5" />
                          ) : (
                            <Eye className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white w-full p-3 rounded-xl mt-2 font-medium hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
                    >
                      Continuer →
                    </button>
                  </div>
                )}

                {signatureRequise && step === 2 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <PenTool className="w-4 h-4 text-blue-600" />
                      <p className="font-semibold text-blue-950">
                        Ajouter votre signature
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-blue-200 rounded-xl overflow-hidden bg-blue-50/30">
                      <SignatureCanvas
                        ref={sigRef}
                        onEnd={signatureEnd}
                        canvasProps={{
                          width: 350,
                          height: 150,
                          className: "w-full",
                        }}
                      />
                    </div>

                    {signatureError && (
                      <p className="text-red-500 text-xs mt-1">{signatureError}</p>
                    )}

                    <button
                      type="button"
                      onClick={clearSignature}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium"
                    >
                      <Eraser className="w-3.5 h-3.5" /> Effacer
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-xl mt-5 font-medium hover:bg-green-700 active:bg-green-800 transition disabled:opacity-50 shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Terminer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
