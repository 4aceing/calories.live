<script lang="ts">
  import { page } from '$app/stores';
  import { LightSwitch, drawerStore } from '@skeletonlabs/skeleton';

  $: classesActive = (path: string) => ($page.url.pathname.includes(path) ? '!bg-primary-500' : '');

  function closeDrawer() {
    drawerStore.close();
  }
</script>

<div class="flex flex-col h-full p-4">
  <nav class="list-nav">
    <ul>
      <li>
        <a on:click={closeDrawer} href="/meals" class={classesActive('/meals')}>All Saved Meals</a>
      </li>
      <li>
        <a on:click={closeDrawer} href="/today" class={classesActive('/today')}>Today's Meals</a>
      </li>
      <li>
        <a on:click={closeDrawer} href="/progress" class={classesActive('/progress')}>Progress</a>
      </li>
      <!-- <li>
        <a on:click={closeDrawer} href="/about" class={classesActive('/about')}>About</a>
      </li> -->
    </ul>
  </nav>

  <div class="pl-4 mt-auto flex items-center gap-4">
    <span>Dark Mode</span>
    <LightSwitch />
  </div>
</div>
