import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

export function confirmModal(body: string, onConfirm: () => void, onReject?: () => void, onComplete?: () => void) {
  const settings: ModalSettings = {
    type: 'confirm',
    title: 'Please Confirm',
    body: body,
    response: (result: boolean) => {
      if (result) {
        onConfirm();
      } else {
        onReject?.();
      }

      onComplete?.();
    },
  };

  modalStore.trigger(settings);
}
