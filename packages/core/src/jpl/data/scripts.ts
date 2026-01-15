import { generateSpk as generateSpkTestData } from "./spk/spk.testData.script";
import { generateSpk as generateSpkFull } from "./spk/spk.full.script";
import { generatePck } from "./pck/pck00011.script";

const kernelsFolder = "../../data/jpl";

async function generateKernels() {
  generateSpkTestData(kernelsFolder);
  generateSpkFull(kernelsFolder);
  
  await generatePck(kernelsFolder);
}

void (async () => { await generateKernels(); })();