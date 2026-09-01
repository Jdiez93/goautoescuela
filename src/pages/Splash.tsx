import { useEffect, useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import autoescuelaAsset from "@/assets/splash-autoescuela.jpg.asset.json";
import formacionAsset from "@/assets/splash-formacion.jpg.asset.json";

const IMG_AUTOESCUELA = autoescuelaAsset.url;
const IMG_CENTRO = formacionAsset.url;

type Side = "left" | "right";

interface HalfProps {
  image: string;
  label: string;
  ariaLabel: string;
  side: Side;
  selected: Side | null;
  onActivate: () => void;
}

function Half({ image, label, ariaLabel, side, selected, onActivate }: HalfProps) {
  const [hover, setHover] = useState(false);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  const isSelected = selected === side;
  const isOther = selected !== null && selected !== side;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={handleKey}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="relative w-full h-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#78FEE1]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform ease-[cubic-bezier(0.7,0,0.84,0)]"
        style={{
          backgroundImage: `url(${image})`,
          transform: isSelected
            ? "scale(2.6)"
            : isOther
            ? "scale(0.9)"
            : hover
            ? "scale(1.05)"
            : "scale(1)",
          transitionDuration: selected ? "1100ms" : "500ms",
        }}
      />
      <div
        className={`absolute inset-0 transition-all ease-out ${
          isSelected
            ? "bg-black/0"
            : isOther
            ? "bg-black/90"
            : hover
            ? "bg-gradient-to-t from-black/80 via-black/30 to-black/40"
            : "bg-gradient-to-t from-black/85 via-black/45 to-black/55"
        }`}
        style={{ transitionDuration: selected ? "900ms" : "500ms" }}
      />
      {/* Mint accent glow on hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          hover && !selected ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            side === "left"
              ? "radial-gradient(circle at 30% 50%, rgba(120,254,225,0.18), transparent 60%)"
              : "radial-gradient(circle at 70% 50%, rgba(120,254,225,0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
        <span
          className={`inline-block font-sans font-black uppercase tracking-[0.15em] text-white text-3xl md:text-5xl lg:text-6xl xl:text-7xl border-b-2 pb-3 transition-all ease-out ${
            isSelected
              ? "border-[#78FEE1] scale-[2] opacity-0"
              : isOther
              ? "border-transparent opacity-0 scale-90"
              : hover
              ? "border-[#78FEE1]"
              : "border-transparent"
          }`}
          style={{
            transitionDuration: selected ? "1100ms" : "500ms",
            textShadow:
              "0 2px 20px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.6), 0 0 60px rgba(120,254,225,0.15)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}


export default function Splash() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Side | null>(null);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSelect = (side: Side, path: string) => {
    if (selected) return;
    setSelected(side);
    window.setTimeout(() => navigate(path), 1050);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen h-[100dvh] overflow-hidden bg-black flex flex-col md:flex-row">
      {/* Left / Top half */}
      <div
        className={`relative w-full h-1/2 md:h-full transition-[width,height,flex] duration-[450ms] ease-out ${
          selected === "left"
            ? "md:w-full h-full"
            : selected === "right"
            ? "md:w-0 h-0 md:h-full"
            : "md:w-1/2"
        }`}
      >
        <Half
          image={IMG_AUTOESCUELA}
          label="Autoescuela"
          ariaLabel="Ir a Autoescuela"
          side="left"
          selected={selected}
          onActivate={() => handleSelect("left", "/home")}
        />
      </div>

      {/* Mint separator */}
      <div
        className={`bg-[#78FEE1] transition-opacity duration-500 ${
          selected ? "opacity-0" : "opacity-100"
        } w-full h-[2px] md:h-full md:w-[2px]`}
        aria-hidden="true"
      />

      {/* Right / Bottom half */}
      <div
        className={`relative w-full h-1/2 md:h-full transition-[width,height,flex] duration-[450ms] ease-out ${
          selected === "right"
            ? "md:w-full h-full"
            : selected === "left"
            ? "md:w-0 h-0 md:h-full"
            : "md:w-1/2"
        }`}
      >
        <Half
          image={IMG_CENTRO}
          label="Centro de Estudio y Formación"
          ariaLabel="Ir a Centro de Estudio y Formación"
          side="right"
          selected={selected}
          onActivate={() => handleSelect("right", "/centro-estudios")}
        />
      </div>

      {/* Mint flash overlay on selection */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#78FEE1] transition-opacity duration-[900ms] ease-out ${
          selected ? "opacity-20" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
