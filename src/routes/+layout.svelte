<script lang="ts">
  // import '../theme.css';
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  import '../app.css';
  import { AppShell, AppBar, Modal, Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import ProfileAvatar from '../components/ProfileAvatar.svelte';
  import SideBar from '../components/SideBar.svelte';
  import CharmMenuHamburger from '~icons/charm/menu-hamburger';

  $: positionClasses = $drawerStore.open ? 'translate-x-[75%]' : '';
</script>

<Modal />

<Drawer>
  <SideBar />
</Drawer>

<AppShell class="transition-transform {positionClasses}" slotSidebarLeft="w-0 md:w-64 bg-surface-500/10">
  <svelte:fragment slot="header">
    <AppBar gap="gap-0" slotLead="md:hidden" slotTrail="place-content-end">
      <svelte:fragment slot="lead">
        <button on:click={() => drawerStore.open({ width: 'w-[75%]' })} class="btn-icon">
          <CharmMenuHamburger />
        </button>
      </svelte:fragment>

      <a href="/" class="btn p-0 flex items-center gap-3" title="Homepage">
        <img class="w-auto h-12" src="/android-chrome-256x256.png" alt="Logo" />
        <h1 class="max-sm:hidden text-xl">Calories Live</h1>
      </a>

      <svelte:fragment slot="trail">
        <ProfileAvatar />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <SideBar />
  </svelte:fragment>

  <div class="container p-10 mx-auto">
    <slot />
  </div>
</AppShell>
