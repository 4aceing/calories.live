import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

export function confirmModal(body: string, onConfirm: () => void) {
  const settings: ModalSettings = {
    type: 'confirm',
    title: 'Please Confirm',
    body: body,
    response: (result: boolean) => {
      if (result) {
        onConfirm();
      }
    },
  };

  modalStore.trigger(settings);
}
