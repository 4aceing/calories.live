<script lang="ts">
  import { popup, type ModalSettings, type PopupSettings, modalStore } from '@skeletonlabs/skeleton';
  import CilOptions from '~icons/cil/options';
  import { createEventDispatcher } from 'svelte';
  import type { Meal } from '../types/Meal';

  export let meal: Meal;

  const dispatch = createEventDispatcher();

  const popupSettings: PopupSettings = {
    event: 'click',
    target: `popupMealCardOptions${Date.now()}${Math.random()}`,
    placement: 'bottom-end',
  };

  const modalConfirmDelete: ModalSettings = {
    type: 'confirm',
    title: 'Please Confirm',
    body: `Are you sure you want to delete this meal '${meal.name}'?`,
    response: (result: boolean) => {
      if (result) {
        dispatch('delete', meal);
      }
    },
  };
</script>

<button use:popup={popupSettings} class="btn-icon variant-filled-secondary">
  <CilOptions />
</button>

<div class="card w-auto shadow-xl p-2 z-10" data-popup={popupSettings.target}>
  <ul class="list">
    <li>
      <a href="/meals/edit?id={meal.id}" class="btn btn-sm w-full justify-start">Edit</a>
    </li>
    <hr class="opacity-50" />
    <li>
      <button on:click={() => modalStore.trigger(modalConfirmDelete)} class="btn btn-sm w-full justify-start">
        Delete
      </button>
    </li>
  </ul>
</div>
