import { SpkKernelCollection } from './';

export class SpkKernelRepository {

    kernels: SpkKernelCollection[];
    
    constructor(kernels: SpkKernelCollection[]) {
        this.kernels = kernels;
    }

}
