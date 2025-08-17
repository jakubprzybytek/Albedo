import { KernelsRepository } from "@jpl/kernels/KernelsRepository";
import { kernelRepository } from "./de440.testData";
import { pckRepository } from "./pck00011";

export const kernels = new KernelsRepository(kernelRepository, pckRepository);
