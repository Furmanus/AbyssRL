import { ExcludeFunctionProperties } from '../interfaces/utility.interfaces';

export abstract class BaseState {
  public abstract serialize(): unknown;
}
