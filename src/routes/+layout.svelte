<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  import '../app.css';
  import { AppShell, AppBar, LightSwitch, popup, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import CharmMenuHamburger from '~icons/charm/menu-hamburger';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  const popupCombobox: PopupSettings = {
    event: 'focus-click',
    target: 'popupCombobox',
    placement: 'bottom-end',
  };
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/" class="btn p-0 flex items-center gap-3" title="Homepage">
          <img class="w-auto h-10" src="/android-chrome-256x256.png" alt="Logo" />
          <h1 class="text-xl">Calories Live</h1>
        </a>
      </svelte:fragment>

      <svelte:fragment slot="trail">
        <button class="md:hidden btn-icon" title="Open Menu" use:popup={popupCombobox}>
          <CharmMenuHamburger />
        </button>

        <div class="card w-48 shadow-xl" data-popup="popupCombobox">
          <ul class="p-4">
            <li>
              <a href="/about" class="text-left btn p-0 mb-3" title="About Page">About</a>
            </li>
            <hr />
            <li>
              <LightSwitch class="mt-4" />
            </li>
          </ul>
        </div>

        <a href="/about" class="hidden md:flex btn" title="About Page">About</a>

        <LightSwitch class="hidden md:block" />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <slot />

  <!-- <svelte:fragment slot="footer">
    <AppBar>Footer</AppBar>
  </svelte:fragment> -->
</AppShell>
