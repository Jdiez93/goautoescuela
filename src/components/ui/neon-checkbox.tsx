import React, { InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface NeonCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

const NeonCheckbox: React.FC<NeonCheckboxProps> = ({
  label,
  className = "",
  checked: controlledChecked,
  defaultChecked,
  onChange,
  id,
  ...props
}) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked || false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  const styles = {
    "--primary": "#78fee1",
    "--primary-dark": "#3fd9b8",
    "--primary-light": "#bdfff0",
    "--size": "26px",
  } as React.CSSProperties;

  const particles = [
    { x: "28px", y: "-22px" }, { x: "-30px", y: "-18px" }, { x: "32px", y: "20px" },
    { x: "-26px", y: "24px" }, { x: "0px", y: "-32px" }, { x: "0px", y: "32px" },
    { x: "32px", y: "0px" }, { x: "-32px", y: "0px" }, { x: "22px", y: "22px" },
    { x: "-22px", y: "-22px" }, { x: "22px", y: "-22px" }, { x: "-22px", y: "22px" },
  ];

  return (
    <label
      htmlFor={id}
      style={styles}
      className={cn("neon-checkbox group inline-flex items-start gap-3 cursor-pointer select-none", className)}
    >
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="sr-only peer"
        {...props}
      />

      <span className="relative inline-block shrink-0" style={{ width: "var(--size)", height: "var(--size)" }}>
        {/* box */}
        <span
          className={cn(
            "absolute inset-0 rounded-md border-2 transition-all duration-300",
            "bg-white/60 backdrop-blur-sm",
            isChecked
              ? "border-[var(--primary)] shadow-[0_0_12px_var(--primary),inset_0_0_8px_var(--primary-light)]"
              : "border-[var(--primary-dark)]/60 group-hover:border-[var(--primary)] group-hover:shadow-[0_0_8px_var(--primary)]"
          )}
        />

        {/* check mark */}
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "absolute inset-0 m-auto w-[70%] h-[70%] transition-all duration-300",
            isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
          fill="none"
          stroke="var(--primary-dark)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 4px var(--primary))" }}
        >
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>

        {/* pulse ring */}
        {isChecked && (
          <span
            key="ring"
            className="absolute inset-0 rounded-md border-2 border-[var(--primary)] pointer-events-none"
            style={{ animation: "neonRingPulse 0.6s ease-out forwards" }}
          />
        )}

        {/* particles */}
        {isChecked && (
          <span className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-[var(--primary)]"
                style={{
                  ["--x" as any]: p.x,
                  ["--y" as any]: p.y,
                  animation: `neonParticle 0.7s ease-out forwards`,
                  animationDelay: `${i * 0.015}s`,
                  boxShadow: "0 0 6px var(--primary)",
                }}
              />
            ))}
          </span>
        )}
      </span>

      {label && <span className="text-sm leading-snug">{label}</span>}

      <style>{`
        @keyframes neonParticle {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0);
            opacity: 0;
          }
        }
        @keyframes neonRingPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </label>
  );
};

export { NeonCheckbox };
