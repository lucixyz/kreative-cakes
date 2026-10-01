import { AiDesigner } from "../store/AiDesigner";
import { Customizer } from "../store/Customizer";

export function AiDesignerPage() {
  return (
    <main className="page-wrap">
      <AiDesigner />
    </main>
  );
}

export function CakeBuilderPage() {
  return (
    <main className="page-wrap">
      <Customizer />
    </main>
  );
}
