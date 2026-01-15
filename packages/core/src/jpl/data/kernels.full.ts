import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { spkRepository } from "./spk/generated/spk.full";
import { pckRepository } from "./pck/generated/pck00011";

export const kernels = new KernelsRepository(spkRepository, pckRepository);
