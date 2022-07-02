export class ForwardLookingArray<Type> {

    readonly array: Type[];

    index: number = 0;

    constructor(array: Type[]) {
        this.array = array;
    }

    find(predicate: (element: Type) => boolean): Type | undefined {
        const startingIndex = this.index;

        while (!predicate(this.array[this.index])) {
            this.index = this.index < this.array.length ? this.index + 1 : 0;
            if (this.index === startingIndex) {
                return undefined;
            }
        }

        return this.array[this.index];
    }

};
