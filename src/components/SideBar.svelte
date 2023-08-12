<script>
  import { LightSwitch, drawerStore } from '@skeletonlabs/skeleton';

  function closeDrawer() {
    drawerStore.close();
  }
</script>

<div class="flex flex-col h-full p-4">
  <nav class="list-nav">
    <ul>
      <li>
        <a on:click={closeDrawer} href="/meals">All Saved Meals</a>
      </li>
      <li>
        <a on:click={closeDrawer} href="/today">Today's Meals</a>
      </li>
      <li>
        <a on:click={closeDrawer} href="/progress">Progress</a>
      </li>
      <li>
        <a on:click={closeDrawer} href="/about">About</a>
      </li>
    </ul>
  </nav>

  <div class="pl-4 mt-auto flex items-center gap-4">
    <span>Dark Mode</span>
    <LightSwitch />
  </div>
</div>
