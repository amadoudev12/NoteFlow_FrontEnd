// ─────────────────────────────────────────────────────────────
// FirstLoginPage.jsx
// Page de première connexion — Gestion Scolaire
// Stack : React JSX + Tailwind CSS
// Validation mot de passe : 8 caractères minimum uniquement
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────
// ICÔNES
// ─────────────────────────────────────────────

const IconEye = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );

const IconSchool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} width={22} height={22}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

// ─────────────────────────────────────────────
// INDICATEUR D'ÉTAPES
// ─────────────────────────────────────────────

function StepIndicator({ current, done, isEnseignant }) {
  const steps = ["Identifiant", "Mot de passe"]
  if(isEnseignant){
    steps.push('Signature')
  }
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((label, i) => {
        const id = i + 1;
        const isDone = done.has(id);
        const isActive = current === id;
        return (
          <React.Fragment key={id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${isDone
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "bg-blue-50 border-blue-600 text-blue-600"
                    : "bg-white border-blue-200 text-blue-300"
                  }`}
              >
                {isDone ? "✓" : id}
              </div>
              <span className={`text-[10px] font-semibold ${isDone || isActive ? "text-blue-600" : "text-blue-300"}`}>
                {label}
              </span>
            </div>
            {i <= 1 && (
              <div className={`h-0.5 w-10 mx-1 mb-4 rounded transition-all ${done.has(id) ? "bg-blue-600" : "bg-blue-100"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// CHAMP GÉNÉRIQUE
// ─────────────────────────────────────────────

function Field({ label, error, hint, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-bold text-blue-800 tracking-wide mb-1">{label}</label>
      {children}
      {!error && hint && <p className="text-[11px] text-blue-300 mt-1">{hint}</p>}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CLASSES INPUT
// ─────────────────────────────────────────────

function inputCls(error, valid) {
  return [
    "w-full px-3 py-2 rounded-lg border-2 text-sm font-medium outline-none transition-all",
    error
      ? "border-red-200 bg-red-50 text-red-900"
      : valid
      ? "border-blue-300 bg-blue-50 text-blue-900"
      : "border-blue-100 bg-slate-50 text-slate-800",
    "focus:border-blue-500 focus:bg-blue-50",
  ].join(" ");
}

// ─────────────────────────────────────────────
// BOUTON PRINCIPAL
// ─────────────────────────────────────────────

function BtnPrimary({ children, onClick, disabled, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all mt-2
        ${disabled
          ? "bg-blue-100 text-blue-300 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
        }`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// SECTION 1 : Login
// ─────────────────────────────────────────────

function LoginSection({ register, errors, watch, onNext }) {
  const login = watch("login") || "";
  const isValid = login.length >= 4;

  return (
    <div>
      <p className="text-sm font-bold text-slate-800 mb-1">Choisissez votre identifiant</p>
      <p className="text-[11px] text-blue-400 mb-5">
        Remplace l'identifiant provisoire qui vous a été attribué.
      </p>
      <Field label="NOUVEL IDENTIFIANT *" error={errors.login?.message} hint="Minimum 4 caractères — sans espaces">
        <input
          {...register("login")}
          autoComplete="username"
          placeholder="ex : jean.dupont"
          className={inputCls(!!errors.login, isValid)}
        />
      </Field>
      <BtnPrimary onClick={onNext}>
        Continuer →
      </BtnPrimary>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION 2 : Mot de passe (8 caractères min seulement)
// ─────────────────────────────────────────────

function PasswordSection({ register, errors, watch, onNext, isEnseignant, isLoading, }) {
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);

  const pw = watch("password") || "";
  const cp = watch("confirmPassword") || "";
  const pwValid = pw.length >= 8;
  const cpValid = cp.length > 0 && cp === pw;
  const canNext = pwValid && cpValid && !errors.password && !errors.confirmPassword;

  return (
    <div>
      <p className="text-sm font-bold text-slate-800 mb-1">Sécurisez votre compte</p>
      <p className="text-[11px] text-blue-400 mb-5">
        Choisissez un mot de passe que vous seul connaissez.
      </p>

      <Field label="NOUVEAU MOT DE PASSE *" error={errors.password?.message} hint="8 caractères minimum">
        <div className="relative">
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputCls(!!errors.password, pwValid) + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500"
          >
            <IconEye open={showPw} />
          </button>
        </div>
      </Field>

      <Field label="CONFIRMER LE MOT DE PASSE *" error={errors.confirmPassword?.message}>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showCp ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputCls(!!errors.confirmPassword, cpValid) + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowCp((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500"
          >
            <IconEye open={showCp} />
          </button>
        </div>
      </Field>
      {
        isEnseignant ? (
          <BtnPrimary onClick={onNext}>
            Continuer →
          </BtnPrimary>
        ) : (
          <BtnPrimary type="submit" disabled={isLoading}>
            ✓ Terminer la configuration
          </BtnPrimary>
        )
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION 3 : Signature
// ─────────────────────────────────────────────

function SignatureSection({ sigRef, signatureError, onSignatureEnd, onClear, isLoading }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-800 mb-1">Apposez votre signature</p>
      <p className="text-[11px] text-blue-400 mb-5">
        Dessinez votre signature officielle dans la zone ci-dessous.
      </p>

      <div className="mb-4">
        <label className="block text-[11px] font-bold text-blue-800 tracking-wide mb-1.5">
          SIGNATURE ÉLECTRONIQUE *
        </label>

        <div
          className={`relative border-2 rounded-xl bg-white overflow-hidden cursor-crosshair transition-colors
            ${signatureError ? "border-red-200" : "border-blue-200"}`}
        >
          <div className="absolute bottom-7 left-4 right-4 border-b border-dashed border-blue-100 pointer-events-none" />
          <SignatureCanvas
            ref={sigRef}
            onEnd={onSignatureEnd}
            penColor="#1e3a5f"
            backgroundColor="transparent"
            canvasProps={{
              className: "w-full block touch-none",
              style: { height: 150 },
            }}
          />
          <span className="absolute bottom-1.5 right-3 text-[9px] text-blue-100 font-bold tracking-widest pointer-events-none select-none uppercase">
            Signature
          </span>
        </div>

        {signatureError && (
          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">⚠ {signatureError}</p>
        )}

        <div className="flex justify-end mt-1.5">
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-blue-300 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-all flex items-center gap-1"
          >
            ✕ Effacer et recommencer
          </button>
        </div>
      </div>

      <BtnPrimary type="submit" disabled={isLoading}>
        {isLoading ? "Enregistrement…" : "✓ Terminer la configuration"}
      </BtnPrimary>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schéma Zod — mot de passe : 8 caractères minimum uniquement
const schema = z
  .object({
    login: z
      .string()
      .min(1, "Ce champ est obligatoire")
      .min(4, "Minimum 4 caractères")
      .regex(/^\S+$/, "Pas d'espaces autorisés"),
    password: z
      .string()
      .min(1, "Ce champ est obligatoire")
      .min(8, "Minimum 8 caractères"),
    confirmPassword: z.string().min(1, "Ce champ est obligatoire"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function FirstLoginComponnent({
  userName,
  onFormDataReady,
  user
}) {
  const isEnseignant = user?.role == "ENSEIGNANT"
  console.log(isEnseignant)
  const sigRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [signatureError, setSignatureError] = useState("");
  const [hasSig, setHasSig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formDataResult, setFormDataResult] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const watchedLogin = watch("login") || "";
  const watchedPassword = watch("password") || "";
  const watchedConfirm = watch("confirmPassword") || "";

  useEffect(() => {
    const next = new Set(completedSteps);
    const loginOk = watchedLogin.length >= 4 && !/\s/.test(watchedLogin) && !errors.login;
    const pwOk =
      watchedPassword.length >= 8 &&
      watchedPassword === watchedConfirm &&
      !errors.password &&
      !errors.confirmPassword;

    loginOk ? next.add(1) : next.delete(1);
    pwOk ? next.add(2) : next.delete(2);
    setCompletedSteps(next);
  }, [watchedLogin, watchedPassword, watchedConfirm, errors.login, errors.password, errors.confirmPassword]);
  const totalSteps = isEnseignant ? 3 : 2
  const progress = Math.round((completedSteps.size / totalSteps) * 100);

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      const ok = await trigger("login");
      if (ok) {
        setCompletedSteps((p) => new Set(p).add(1));
        setCurrentStep(2);
      }
    } else if (currentStep === 2 && isEnseignant) {
      // Seulement pour les enseignants : valider et passer à l'étape 3
      const ok = await trigger(["password", "confirmPassword"]);
      if (ok) {
        setCompletedSteps((p) => new Set(p).add(2));
        setCurrentStep(3);
      }
    }
  }, [currentStep, trigger, isEnseignant]);

  const onSignatureEnd = useCallback(() => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setHasSig(true);
      setSignatureError("");
      setCompletedSteps((p) => new Set(p).add(3));
    }
  }, []);

  const clearSignature = useCallback(() => {
    sigRef.current?.clear();
    setHasSig(false);
    setSignatureError("");
    setCompletedSteps((p) => { const n = new Set(p); n.delete(3); return n; });
  }, []);

  const onSubmit = useCallback(async (values) => {
  if (isEnseignant && (!sigRef.current || sigRef.current.isEmpty())) {
    setSignatureError("Veuillez apposer votre signature avant de continuer");
    return;
  }
  setIsLoading(true);
  try {
    let signatureBlob = null; // ← déclaré ici, accessible partout

    if (isEnseignant) {
      signatureBlob = await new Promise((resolve, reject) => {
        sigRef.current.getCanvas().toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Conversion échouée"))),
          "image/png"
        );
      });
    }

    const formData = new FormData();
    formData.append("login", values.login);
    formData.append("password", values.password);
    if (isEnseignant && signatureBlob) {
      formData.append("signature", signatureBlob, "signature.png");
    }

    if (onFormDataReady) await onFormDataReady(formData);
    if (isEnseignant) {
      setFormDataResult({ login: values.login, signatureSize: signatureBlob.size ?? "" });
    }
    setSuccess(true);
  } catch (err) {
    console.error("Erreur :", err);
  } finally {
    setIsLoading(false);
  }
}, [onFormDataReady, isEnseignant]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">

        {/* En-tête */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-3">
            <IconSchool />
          </div>
          <p className="text-xs text-blue-400">
            Bienvenue, <span className="font-bold text-blue-600">{userName}</span>
          </p>
        </div>

        {/* Carte */}
        <div className="bg-white/90 backdrop-blur border border-blue-100 rounded-2xl p-8 shadow-lg shadow-blue-100">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                ✓
              </div>
              <p className="text-base font-bold text-slate-800 mb-2">Configuration terminée !</p>
              <p className="text-xs text-blue-400 leading-relaxed">
                Votre compte est maintenant configuré.<br />
                Vous pouvez accéder à l'application.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Configuration initiale requise.</strong> Complétez les 3 étapes pour accéder à l'application.
                </p>
              </div>

              <StepIndicator current={currentStep} done={completedSteps} isEnseignant={isEnseignant} />

              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-blue-300 font-medium">Progression</span>
                  <span className="text-[11px] text-blue-600 font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {currentStep === 1 && (
                  <LoginSection register={register} errors={errors} watch={watch} onNext={handleNext} />
                )}
                {currentStep === 2 && (
                  <PasswordSection 
                      register={register} 
                      errors={errors} 
                      watch={watch} 
                      onNext={handleNext} 
                      isEnseignant={isEnseignant}
                      isLoading={isLoading}
                  />
                )}
                {
                  isEnseignant && (
                    currentStep === 3 && (
                      <SignatureSection
                        sigRef={sigRef}
                        signatureError={signatureError}
                        onSignatureEnd={onSignatureEnd}
                        onClear={clearSignature}
                        isLoading={isLoading}
                      />
                    )
                  )
                }
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-blue-300 mt-4">
          Vos données sont chiffrées et sécurisées.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UTILISATION (App.jsx)
// ─────────────────────────────────────────────
//
// import FirstLoginPage from './FirstLoginPage';
//
// function App() {
//   const handleFormData = async (formData) => {
//     await axios.post('/api/auth/first-login', formData);
//     navigate('/dashboard');
//   };
//   return <FirstLoginPage userName="Mamadou Bah" onFormDataReady={handleFormData} />;
// }