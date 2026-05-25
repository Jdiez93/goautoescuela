import CentroNavbar from "@/components/centro/CentroNavbar";
import CentroFooter from "@/components/centro/CentroFooter";

export default function CentroEstudios() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CentroNavbar />
      <main className="flex-1 pt-[72px] md:pt-24 flex items-center justify-center px-6 bg-black">
        <h1 className="font-sans font-bold uppercase tracking-wider text-white text-4xl md:text-6xl lg:text-7xl border-b-2 border-[#78FEE1] pb-2 text-center">
          Centro de Estudio y Formación
        </h1>
      </main>
      <CentroFooter />
    </div>
  );
}
