// export const ssr = false;
export const prerender = true;

import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
import { storePopup, drawerStore } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
// drawerStore.set({ width: "w-[50%]" })
