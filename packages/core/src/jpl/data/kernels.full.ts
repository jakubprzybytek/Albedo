import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { kernelRepository } from "./de440.full";
import { pckRepository } from "./pck00011";

export const kernels = new KernelsRepository(kernelRepository, pckRepository);
