import { Observer } from './observer';

export class Constructor extends Observer {
  constructor() {
    super();

    // this.initialize();
  }

  protected initialize(config?: any): void {
    // Default function called if no initialize method is found in sub-classes
  }
}
