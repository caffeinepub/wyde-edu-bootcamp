import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { createActorWithConfig } from "../config";

interface FormData {
  fullName: string;
  whatsapp: string;
  email: string;
  college: string;
  courseLevel: string;
  referral: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  whatsapp: "",
  email: "",
  college: "",
  courseLevel: "",
  referral: "",
};

function StepIndicator({ step }: { step: number }) {
  if (step > 2) return null;
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: s <= step ? "#00e676" : "rgba(0,230,118,0.15)",
              color: s <= step ? "#052013" : "#A8C3B2",
              border:
                s === step
                  ? "2px solid #00e676"
                  : "2px solid rgba(0,230,118,0.2)",
            }}
          >
            {s}
          </div>
          {s < 2 && (
            <div
              className="w-12 h-0.5"
              style={{
                background: step > 1 ? "#00e676" : "rgba(0,230,118,0.2)",
              }}
            />
          )}
        </div>
      ))}
      <p className="ml-2 text-sm text-wyde-muted font-medium">
        Step {step} of 2
      </p>
    </div>
  );
}

function FormInput({
  label,
  required,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-wyde-muted mb-1.5"
      >
        {label} {required && <span style={{ color: "#00e676" }}>*</span>}
      </label>
      <input id={id} className="form-input" required={required} {...props} />
    </div>
  );
}

function FormSelect({
  label,
  required,
  id,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  id: string;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-wyde-muted mb-1.5"
      >
        {label} {required && <span style={{ color: "#00e676" }}>*</span>}
      </label>
      <select id={id} className="form-input" required={required} {...props}>
        <option value="">Select an option</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Compress & resize image file to a base64 data URL (max 800px, 70% quality) */
async function compressImageToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [screenshotError, setScreenshotError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  const UPI_ID = "mohammednaseemkc@oksbi";
  const GPAY_NUMBER = "+91 8547339451";

  function handleFormChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleCompleteRegistration() {
    if (!screenshotFile) {
      setScreenshotError(true);
      return;
    }

    setScreenshotError(false);
    setIsSubmitting(true);
    setUploadProgress(10);

    let screenshotDataUrl = "";
    try {
      setUploadProgress(30);
      screenshotDataUrl = await compressImageToDataURL(screenshotFile);
      setUploadProgress(70);
    } catch {
      screenshotDataUrl = `Uploaded - ${screenshotFile.name}`;
    }

    const now = new Date().toISOString();

    // Save to backend database
    try {
      const actor = await createActorWithConfig();
      await actor.register({
        fullName: form.fullName,
        whatsapp: form.whatsapp,
        email: form.email,
        college: form.college,
        courseLevel: form.courseLevel,
        referral: form.referral,
        paymentScreenshot: screenshotDataUrl,
        timestamp: now,
      });
      setUploadProgress(90);
    } catch {
      // Continue even if backend fails
    }

    // Submit to Google Forms via hidden iframe (reliable method)
    try {
      const iframeName = `hidden_iframe_${Date.now()}`;
      const iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const gform = document.createElement("form");
      gform.method = "POST";
      gform.action =
        "https://docs.google.com/forms/d/e/1FAIpQLSe2Nr4VzaTgyk76d4YIGknvXbK62tzTdUVV8C3E_chwC1Z1bA/formResponse";
      gform.target = iframeName;

      const fields: Record<string, string> = {
        "entry.775159535": form.fullName,
        "entry.2099177540": form.whatsapp,
        "entry.227607606": form.email,
        "entry.1415459623": form.college,
        "entry.639149376": form.courseLevel,
        "entry.1165469576": form.referral,
        "entry.62474854": `Screenshot uploaded (${screenshotFile.name})`,
        "entry.425905488": now,
      };

      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value || "";
        gform.appendChild(input);
      }

      document.body.appendChild(gform);
      gform.submit();

      setTimeout(() => {
        try {
          document.body.removeChild(gform);
          document.body.removeChild(iframe);
        } catch {
          // ignore
        }
      }, 3000);
    } catch {
      // Ignore errors — always proceed
    }

    setUploadProgress(100);
    setIsSubmitting(false);
    setStep(3);
  }

  function copyUPI() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    });
  }

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Header */}
      <div
        className="sticky top-0 z-50 w-full mb-8"
        style={{
          background: "rgba(6, 20, 13, 0.92)",
          borderBottom: "1px solid rgba(0,230,118,0.2)",
          backdropFilter: "blur(12px)",
          marginLeft: "-1rem",
          marginRight: "-1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-extrabold font-display"
            style={{ color: "#00e676" }}
            data-ocid="register.link"
          >
            ← Wyde Edu
          </Link>
          <span className="text-wyde-muted text-sm">
            AI Tools Bootcamp Registration
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepIndicator step={1} />
              <div className="glass-card p-6 md:p-8">
                <h1 className="text-2xl font-extrabold font-display text-wyde-text mb-1">
                  Personal Details
                </h1>
                <p className="text-wyde-muted text-sm mb-6">
                  Fill in your information to reserve your seat
                </p>

                <form
                  onSubmit={handleStep1Submit}
                  className="flex flex-col gap-4"
                >
                  <FormInput
                    label="Full Name"
                    required
                    id={`${baseId}-name`}
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) =>
                      handleFormChange("fullName", e.target.value)
                    }
                    data-ocid="register.input"
                  />
                  <FormInput
                    label="WhatsApp Number"
                    required
                    id={`${baseId}-whatsapp`}
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={form.whatsapp}
                    onChange={(e) =>
                      handleFormChange("whatsapp", e.target.value)
                    }
                    data-ocid="register.input"
                  />
                  <FormInput
                    label="Email Address"
                    required
                    id={`${baseId}-email`}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    data-ocid="register.input"
                  />
                  <FormInput
                    label="College / Institution Name"
                    required
                    id={`${baseId}-college`}
                    type="text"
                    placeholder="Enter your college name"
                    value={form.college}
                    onChange={(e) =>
                      handleFormChange("college", e.target.value)
                    }
                    data-ocid="register.input"
                  />
                  <FormSelect
                    label="Course Level"
                    id={`${baseId}-course`}
                    options={["HSS", "UG", "PG", "Self-learner"]}
                    value={form.courseLevel}
                    onChange={(e) =>
                      handleFormChange("courseLevel", e.target.value)
                    }
                    data-ocid="register.select"
                  />
                  <FormSelect
                    label="How did you hear about us?"
                    id={`${baseId}-referral`}
                    options={["Instagram", "WhatsApp", "Friend", "Other"]}
                    value={form.referral}
                    onChange={(e) =>
                      handleFormChange("referral", e.target.value)
                    }
                    data-ocid="register.select"
                  />

                  <button
                    type="submit"
                    className="glow-btn px-6 py-3 text-base font-bold mt-2"
                    data-ocid="register.submit_button"
                  >
                    Next →
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepIndicator step={2} />
              <div className="glass-card p-6 md:p-8">
                {/* Summary */}
                <div
                  className="rounded-xl p-4 mb-6"
                  style={{
                    background: "rgba(0,230,118,0.08)",
                    border: "1px solid rgba(0,230,118,0.3)",
                  }}
                >
                  <p className="text-wyde-text font-semibold text-sm">
                    You're registering for{" "}
                    <strong>AI Tools & Prompt Engineering Bootcamp</strong> —{" "}
                    <span style={{ color: "#00e676" }}>₹99</span>
                  </p>
                </div>

                <h2 className="text-xl font-bold font-display text-wyde-text mb-4">
                  Choose Payment Method
                </h2>

                {/* Payment Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* GPay */}
                  <a
                    href={`gpay://upi/pay?pa=${UPI_ID}&pn=WydeEdu&am=99&cu=INR`}
                    className="payment-card p-5 flex flex-col items-center gap-3 text-center no-underline"
                    data-ocid="payment.primary_button"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
                      style={{
                        background: "rgba(0,230,118,0.15)",
                        border: "2px solid rgba(0,230,118,0.4)",
                      }}
                    >
                      G
                    </div>
                    <div>
                      <p className="text-wyde-text font-bold">Google Pay</p>
                      <p className="text-wyde-muted text-xs mt-1">
                        Tap to open GPay
                      </p>
                      <p className="text-xs mt-2" style={{ color: "#00e676" }}>
                        {GPAY_NUMBER}
                      </p>
                    </div>
                  </a>

                  {/* UPI / QR */}
                  <a
                    href={`upi://pay?pa=${UPI_ID}&pn=WydeEdu&am=99&cu=INR`}
                    className="payment-card p-5 flex flex-col items-center gap-3 text-center no-underline"
                    data-ocid="payment.secondary_button"
                  >
                    <img
                      src="/assets/uploads/IMG-20260318-WA0022-1-1.jpg"
                      alt="UPI QR Code"
                      className="rounded-xl object-contain"
                      style={{ width: 140, height: 140 }}
                    />
                    <div className="w-full">
                      <p className="text-wyde-text font-bold">
                        UPI / QR Scanner
                      </p>
                      <p className="text-wyde-muted text-xs mt-1">
                        Amount: ₹99
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "#00e676" }}
                        >
                          {UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            copyUPI();
                          }}
                          className="text-xs px-2 py-0.5 rounded font-semibold"
                          style={{
                            background: "rgba(0,230,118,0.2)",
                            color: "#00e676",
                            border: "1px solid rgba(0,230,118,0.4)",
                          }}
                          data-ocid="payment.toggle"
                        >
                          {copiedUPI ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Screenshot Upload */}
                <div className="mb-6">
                  <label
                    htmlFor="screenshot-upload"
                    className="block text-sm font-semibold text-wyde-muted mb-2"
                  >
                    Upload Payment Screenshot{" "}
                    <span style={{ color: "#00e676" }}>*</span>
                  </label>
                  <button
                    type="button"
                    className="rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer w-full transition-colors"
                    style={{
                      border: screenshotError
                        ? "2px dashed #f87171"
                        : "2px dashed rgba(0,230,118,0.35)",
                      background: screenshotError
                        ? "rgba(248,113,113,0.05)"
                        : "rgba(0,0,0,0.3)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="payment.dropzone"
                    aria-label="Upload payment screenshot"
                  >
                    {screenshotPreview ? (
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot preview"
                        className="rounded-lg object-cover max-h-40 w-auto"
                      />
                    ) : (
                      <span className="text-2xl">📸</span>
                    )}
                    <span className="text-wyde-muted text-sm">
                      {screenshotFile
                        ? screenshotFile.name
                        : "Tap to upload payment screenshot"}
                    </span>
                    {screenshotFile && (
                      <span className="text-xs" style={{ color: "#00e676" }}>
                        ✓ Screenshot selected — tap to change
                      </span>
                    )}
                    {!screenshotFile && (
                      <span className="text-xs text-wyde-muted opacity-60">
                        PNG, JPG accepted
                      </span>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setScreenshotFile(file);
                      if (file) {
                        setScreenshotError(false);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setScreenshotPreview(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setScreenshotPreview(null);
                      }
                    }}
                    data-ocid="payment.upload_button"
                  />
                  {screenshotError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm font-medium"
                      style={{ color: "#f87171" }}
                      data-ocid="payment.error_state"
                    >
                      ⚠️ Payment screenshot is required to complete registration.
                    </motion.p>
                  )}
                </div>

                {/* Upload progress bar */}
                {isSubmitting && (
                  <div className="mb-4">
                    <div
                      className="w-full rounded-full h-2 overflow-hidden"
                      style={{ background: "rgba(0,230,118,0.15)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "#00e676" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <p className="text-xs text-wyde-muted mt-1 text-center">
                      Processing... {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-full font-semibold text-wyde-muted"
                    style={{
                      border: "1px solid rgba(0,230,118,0.3)",
                      background: "transparent",
                    }}
                    data-ocid="register.cancel_button"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    disabled={!screenshotFile || isSubmitting}
                    className="flex-[2] glow-btn py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    data-ocid="register.submit_button"
                  >
                    {isSubmitting ? "Processing..." : "Complete Registration →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="glass-card p-8 md:p-10 text-center"
                data-ocid="register.success_state"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h1
                  className="text-3xl font-extrabold font-display mb-2"
                  style={{ color: "#00e676" }}
                >
                  You're Registered!
                </h1>
                <p className="text-wyde-muted mb-6">
                  Here's a summary of your registration:
                </p>

                <div
                  className="text-left rounded-xl p-4 mb-6 space-y-2"
                  style={{
                    background: "rgba(0,230,118,0.06)",
                    border: "1px solid rgba(0,230,118,0.2)",
                  }}
                >
                  {[
                    { label: "Name", value: form.fullName },
                    { label: "WhatsApp", value: form.whatsapp },
                    { label: "Email", value: form.email },
                    { label: "College", value: form.college },
                    {
                      label: "Course Level",
                      value: form.courseLevel || "Not specified",
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-2 text-sm">
                      <span className="text-wyde-muted font-medium w-28 shrink-0">
                        {row.label}:
                      </span>
                      <span className="text-wyde-text">{row.value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://chat.whatsapp.com/Kl8GtiIiWkl5T626ju4BWL?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="register.primary_button"
                  className="block"
                >
                  <button
                    type="button"
                    className="glow-btn w-full py-4 text-base font-black mb-5"
                  >
                    Join Our WhatsApp Group →
                  </button>
                </a>

                <p className="text-wyde-muted text-sm">
                  📲 Your Google Meet link will be shared in the WhatsApp group
                  before the event.
                </p>

                <Link to="/" className="block mt-6" data-ocid="register.link">
                  <span className="text-sm" style={{ color: "#00e676" }}>
                    ← Back to Homepage
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
