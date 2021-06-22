import { ModalView } from './modal_view';

export type DevFeaturesModalViewElements = {};

export class DevFeaturesModalView extends ModalView<DevFeaturesModalViewElements> {
  protected onWindowKeydownCallback = (e: KeyboardEvent): void => {
    console.log(e.key, this);
  };

  // TODO inspect weird bug with clicking overlay of dev modal after opening inventory
}
