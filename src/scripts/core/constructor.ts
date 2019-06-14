import {Observer} from './observer';

export class Constructor extends Observer {
    constructor() {
        super();

        // this.initialize();
    }
    // tslint:disable-next-line:no-any
    protected initialize(config?: any): void {
        // Default function called if no initialize method is found in sub-classes
    }
}
