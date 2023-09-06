<script lang="ts">
  import { accessProfile, getSavedPasswordOfProfile } from '../utils/FirebaseDatabase';
  import { confirmModal } from '../utils/ModalTrigger';
  import { errorToast, successToast, warningToast } from '../utils/ToastTrigger';
  import { mealsStore } from '../utils/stores/MealsStore';
  import { setProfile } from '../utils/stores/ProfileStore';
  import { progressStore } from '../utils/stores/ProgressStore';
  import { todayMealsStore } from '../utils/stores/TodayMealsStore';
  import BaseModal from './building-blocks/BaseModal.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  let profile = {
    name: '',
    password: undefined,
  };

  let submitFormButton: HTMLButtonElement;

  async function accessExistingProfile() {
    const succedded = await accessProfile(profile.name, profile.password);

    if (succedded) {
      const savedPassword = await getSavedPasswordOfProfile(profile.name);

      modalStore.close();

      if ($mealsStore.length) {
        confirmModal(
          `<p>You seem to have data saved locally</p>
           <p>All data will be lost if you choose to access this profile</p>
           <p>Access profile?</p>`,
          () => {
            successToast(`Profile '${profile.name}' accessed`);

            setProfile(profile.name, savedPassword);

            warningToast(`All locally saved data was lost`);

            mealsStore.set([]);
            todayMealsStore.set([]);
            progressStore.set([]);

            modalStore.close();
          },
        );

        return;
      }

      successToast(`Profile '${profile.name}' accessed`);

      setProfile(profile.name, savedPassword);

      return;
    }

    errorToast(`Invalid name or password`);
  }
</script>

<BaseModal title="Access Profile">
  <svelte:fragment slot="content">
    <form class="space-y-4" on:submit|preventDefault={accessExistingProfile}>
      <label class="label">
        <span>Name</span>
        <input bind:value={profile.name} class="input variant-form-material" type="text" />
      </label>

      <label class="label">
        <span>Password</span>
        <input bind:value={profile.password} class="input variant-form-material" type="password" />
      </label>

      <button bind:this={submitFormButton} type="submit" class="hidden" />
    </form>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <button on:click={() => modalStore.close()} type="button" class="btn variant-ringed-surface">Cancel</button>
    <button on:click={() => submitFormButton.click()} type="button" class="btn variant-ghost-primary">Access</button>
  </svelte:fragment>
</BaseModal>
