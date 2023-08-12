import { toastStore } from '@skeletonlabs/skeleton';

export function successToast(message: string) {
  toastStore.trigger({
    message,
    background: 'variant-filled-success',
  });
}

export function warningToast(message: string) {
  toastStore.trigger({
    message,
    background: 'variant-filled-warning',
  });
}

export function errorToast(message: string) {
  toastStore.trigger({
    message,
    background: 'variant-filled-error',
  });
}
