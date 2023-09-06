<script lang="ts">
  import { popup, type ModalSettings, type PopupSettings, modalStore } from '@skeletonlabs/skeleton';
  import MaterialSymbolsPerson from '~icons/material-symbols/person';
  import CreateProfileModal from './CreateProfileModal.svelte';
  import AccessProfileModal from './AccessProfileModal.svelte';
  import { dissconnectProfile, profileStore } from '../utils/stores/ProfileStore';

  $: profile = $profileStore.name;

  $: popupSettings = {
    event: 'click',
    target: profile ? 'popupActiveProfile' : 'popupProfile',
    placement: 'bottom-end',
  } as PopupSettings;

  const modalCreateProfile: ModalSettings = {
    type: 'component',
    component: {
      ref: CreateProfileModal,
    },
  };

  const modalAccessProfile: ModalSettings = {
    type: 'component',
    component: {
      ref: AccessProfileModal,
    },
  };
</script>

<figure
  use:popup={popupSettings}
  class="flex aspect-square text-surface-50 font-semibold justify-center items-center overflow-hidden isolate {profile
    ? 'bg-primary-400-500-token'
    : 'bg-surface-400-500-token'} w-10 border-4 border-surface-300-600-token hover:!border-primary-500 rounded-full cursor-pointer"
  title="Profile"
>
  <MaterialSymbolsPerson class="{profile ? 'variant-filled-primary' : 'variant-filled'} !bg-transparent w-6 h-6" />
</figure>

<div class="card w-56 shadow-xl p-4 space-y-4" data-popup="popupProfile">
  <p class="text-sm text-center">You can save your data and progress across multiple devices by creating a profile</p>

  <button
    on:click={() => modalStore.trigger(modalCreateProfile)}
    type="button"
    class="btn btn-sm variant-ringed-primary w-full"
  >
    Create Profile
  </button>

  <button
    on:click={() => modalStore.trigger(modalAccessProfile)}
    type="button"
    class="btn btn-sm variant-ringed-primary w-full"
  >
    Access Profile
  </button>
</div>

<div class="card w-56 shadow-xl p-4 space-y-4" data-popup="popupActiveProfile">
  <p class="text-sm text-center">Connected with profile '{profile}'</p>

  <button on:click={() => dissconnectProfile()} type="button" class="btn btn-sm variant-ringed-error w-full">
    Dissconnect
  </button>
</div>
