import { ModalController } from './modal_controller';
import { DevFeaturesModalView } from '../view/dev_features_modal_view';
import { ModalActions } from '../constants/game_actions';
import { devFeatureModalTemplate } from '../../templates/dev_features_modal_template';

export class DevFeaturesModalController extends ModalController<DevFeaturesModalView> {
  protected view = new DevFeaturesModalView(devFeatureModalTemplate);

  public constructor() {
    super();

    this.attachEvents();
  }

  public openModal(): void {
    super.openModal();

    this.view.attachEvents();
  }

  public closeModal(): void {
    super.closeModal();

    this.view.detachEvents();

    this.notify(ModalActions.CloseModal);
  }
}
