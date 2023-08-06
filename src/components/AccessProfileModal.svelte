<script lang="ts">
  import BaseModal from './building-blocks/BaseModal.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  let submitFormButton: HTMLButtonElement;
</script>

<BaseModal title="Access Profile">
  <svelte:fragment slot="content">
    <form class="space-y-4">
      <label class="label">
        <span>Name</span>
        <input class="input variant-form-material" type="text" />
      </label>

      <label class="label">
        <span>Password</span>
        <input class="input variant-form-material" type="password" />
      </label>

      <button bind:this={submitFormButton} type="submit" class="hidden" />
    </form>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <button on:click={() => modalStore.close()} type="button" class="btn variant-ringed-surface">Cancel</button>
    <button on:click={() => submitFormButton.click()} type="button" class="btn variant-ghost-primary">Access</button>
  </svelte:fragment>
</BaseModal>
