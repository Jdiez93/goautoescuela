import { useEffect, useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

// TODO: reemplazar placeholders por imágenes definitivas en /public
const IMG_AUTOESCUELA = "/placeholder-autoescuela.jpg";
const IMG_CENTRO = "/placeholder-centro-estudios.jpg";

interface HalfProps {
  image: string;
  label: string;
  ariaLabel: string;
  onActivate: () => void;
}

function Half({ image, label, ariaLabel, onActivate }: HalfProps) {
  const [hover, setHover] = useState(false);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

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
      {/* Imagen con scale en hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url(${image})`,
          transform: hover ? "scale(1.05)" : "scale(1)",
        }}
      />
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          hover ? "bg-black/20" : "bg-black/40"
        }`}
      />
      {/* Texto */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
        <span
          className={`inline-block font-sans font-bold uppercase tracking-wider text-white text-4xl md:text-6xl lg:text-7xl border-b-2 transition-all duration-500 pb-2 ${
            hover ? "border-[#78FEE1]" : "border-transparent"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex flex-col md:flex-row">
      <div className="relative w-full h-1/2 md:w-1/2 md:h-full">
        <Half
          image={IMG_AUTOESCUELA}
          label="Autoescuela"
          ariaLabel="Ir a Autoescuela"
          onActivate={() => navigate("/home")}
        />
      </div>

      {/* Separador mint */}
      <div
        className="bg-[#78FEE1] w-full h-[2px] md:h-full md:w-[2px]"
        aria-hidden="true"
      />

      <div className="relative w-full h-1/2 md:w-1/2 md:h-full">
        <Half
          image={IMG_CENTRO}
          label="Centro de Estudios y Formación"
          ariaLabel="Ir a Centro de Estudios y Formación"
          onActivate={() => navigate("/centro-estudios")}
        />
      </div>
    </div>
  );
}
