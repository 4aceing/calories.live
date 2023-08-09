// export const prerender = true;
// export const trailingSlash = 'always';

import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
import { storePopup } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
