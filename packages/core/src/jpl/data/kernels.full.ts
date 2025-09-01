import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { spkRepository } from "./spk/spk.full";
import { pckRepository } from "./pck/pck00011";

export const kernels = new KernelsRepository(spkRepository, pckRepository);
