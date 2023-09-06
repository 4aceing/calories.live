<script lang="ts">
  import { createProfile, getSavedPasswordOfProfile } from '../utils/FirebaseDatabase';
  import { confirmModal } from '../utils/ModalTrigger';
  import { errorToast, infoToast, successToast, warningToast } from '../utils/ToastTrigger';
  import { mealsStore } from '../utils/stores/MealsStore';
  import { setProfile } from '../utils/stores/ProfileStore';
  import { progressStore } from '../utils/stores/ProgressStore';
  import { todayMealsStore } from '../utils/stores/TodayMealsStore';
  import BaseModal from './building-blocks/BaseModal.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';

  let submitFormButton: HTMLButtonElement;

  let profile = {
    name: '',
    password: undefined,
  };

  async function createNewProfile() {
    const succedded = await createProfile(profile.name, profile.password);

    if (succedded) {
      successToast(`Profile '${profile.name}' created`);

      setProfile(profile.name, await getSavedPasswordOfProfile(profile.name));

      if ($mealsStore.length) {
        confirmModal(
          `<p>You seem to have data saved locally</p>
           <p>Do you want to transfer it to the newly created profile?</p>
           <p>All data will be lost if you choose to not transfer it</p>`,
          () => {
            // transfer data to firestore

            successToast(`All locally saved data was transfered to the profile`);
          },
          () => {
            warningToast(`All locally saved data was lost`);
          },
          () => {
            mealsStore.set([]);
            todayMealsStore.set([]);
            progressStore.set([]);

            modalStore.close();

            infoToast(`Any data you save on a profile will persisit on that profile`);
          },
        );
      } else {
        infoToast(`Any data you save on a profile will persisit on that profile`);
      }

      modalStore.close();
      return;
    }

    errorToast(`Profile with name '${profile.name}' already exists`);
  }
</script>

<BaseModal title="Create Profile">
  <svelte:fragment slot="content">
    <form class="space-y-4" on:submit|preventDefault={createNewProfile}>
      <label class="label">
        <span>Name</span>
        <input bind:value={profile.name} class="input variant-form-material" name="profile-name" type="text" required />
      </label>

      <label class="label">
        <span>Password (optional)</span>
        <input
          bind:value={profile.password}
          class="input variant-form-material"
          name="profile-password"
          type="password"
        />
      </label>

      <button bind:this={submitFormButton} type="submit" class="hidden" />
    </form>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <button on:click={() => modalStore.close()} type="button" class="btn variant-ringed-surface">Cancel</button>
    <button on:click={() => submitFormButton.click()} type="button" class="btn variant-ghost-primary">Create</button>
  </svelte:fragment>
</BaseModal>
