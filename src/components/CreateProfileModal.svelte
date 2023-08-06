<script lang="ts">
  import BaseModal from './building-blocks/BaseModal.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  let submitFormButton: HTMLButtonElement;
  let removeClassTimeout: NodeJS.Timeout;

  function addErrorClassToInput(event: Event) {
    const input = event.target as HTMLInputElement;

    input.classList.add('input-error');

    removeClassTimeout = setTimeout(() => {
      input.classList.remove('input-error');
    }, 5000);
  }

  function removeErrorClassToInput(event: Event) {
    const input = event.target as HTMLInputElement;

    input.classList.remove('input-error');

    clearTimeout(removeClassTimeout);
  }
</script>

<BaseModal title="Create Profile">
  <svelte:fragment slot="content">
    <form class="space-y-4">
      <label class="label">
        <span>Name</span>
        <input
          on:invalid={addErrorClassToInput}
          on:input={removeErrorClassToInput}
          on:blur={removeErrorClassToInput}
          class="input variant-form-material"
          type="text"
          required
        />
      </label>

      <label class="label">
        <span>Password (optional)</span>
        <input class="input variant-form-material" type="password" />
      </label>

      <button bind:this={submitFormButton} type="submit" class="hidden" />
    </form>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <button on:click={() => modalStore.close()} type="button" class="btn variant-ringed-surface">Cancel</button>
    <button on:click={() => submitFormButton.click()} type="button" class="btn variant-ghost-primary">Create</button>
  </svelte:fragment>
</BaseModal>
