import { Modal } from '../modal';
import { aboutGameModalView, AboutGameModalView } from './aboutGameModal.view';

class AboutGameModal extends Modal<
  void,
  AboutGameModalView
> {
  protected view = aboutGameModalView;
}

export const aboutGameModalController = new AboutGameModal();
