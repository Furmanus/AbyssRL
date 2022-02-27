import { BaseController } from '../../core/base.controller';
import { ModalController } from '../modal.controller';
import { aboutGameModalView, AboutGameModalView } from './aboutGameModal.view';

class AboutGameModalController extends ModalController<
  void,
  AboutGameModalView
> {
  protected view = aboutGameModalView;
}

export const aboutGameModalController = new AboutGameModalController();
