<script lang="ts">
  import { FileDropzone, RadioGroup, RadioItem, toastStore } from '@skeletonlabs/skeleton';
  import MaterialSymbolsArrowBackIos from '~icons/material-symbols/arrow-back-ios';
  import UilImageUpload from '~icons/uil/image-upload';
  import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';
  import { MealCalculatedAs, type Meal } from '../../../types/Meal';
  import { imageToBase64AndResize } from '../../../utils/ImageProcess';
  import { storeMeals } from '../../../utils/LocalStorage';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  const mealId = data.id;

  const model = $storeMeals.find((meal) => meal.id === mealId) || ({} as Meal);

  const initialName = model.name;
  let imagePreview = model.imageUrl || '';
  let imageUrlInput: HTMLInputElement;

  async function imageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files![0];

    imagePreview = await imageToBase64AndResize(file, 560, 240);
  }

  onMount(() => {
    if (!$storeMeals.find((meal) => meal.id === mealId)) {
      toastStore.trigger({
        message: `Meal was not found for editing`,
        background: 'variant-soft-error',
      });

      goto('/meals');
    }
  });

  function imageUrl() {
    imagePreview = imageUrlInput.value && imageUrlInput.validity.valid ? imageUrlInput.value : '';
  }

  function editMeal() {
    if ($storeMeals.find((meal) => meal.id !== mealId && meal.name === model.name)) {
      toastStore.trigger({
        message: `A meal named '${model.name}' already exists`,
        background: 'variant-soft-error',
      });

      return;
    }

    model.imageUrl = imagePreview;

    model.updatedAtTimestamp = Date.now();

    model.protein = +parseFloat(`${model.protein}`).toFixed(2);
    model.carbs = +parseFloat(`${model.carbs}`).toFixed(2);
    model.fat = +parseFloat(`${model.fat}`).toFixed(2);
    model.calculatedCalories = model.protein * 4 + model.carbs * 4 + model.fat * 9;

    storeMeals.update((meals) => {
      const index = meals.findIndex((meal) => meal.id === mealId);
      meals.splice(index, 1, model);
      return meals;
    });

    toastStore.trigger({
      message: `Meal '${model.name}' was edited`,
      background: 'variant-soft-success',
    });

    goto('/meals');
  }
</script>

<a href="/meals" class="btn btn-sm !bg-transparent pl-0 pt-0 mb-4">
  <MaterialSymbolsArrowBackIos class="mr-2" />
  Back to all meals
</a>

<h1 class="text-2xl mb-2">Edit meal '{initialName}'</h1>

<h4 class="text-base mb-8">
  In case you change the nutritional values the history will be recalculated and updated with the new values
</h4>

<form on:submit|preventDefault={editMeal} class="space-y-6">
  <label class="label">
    <span>Name</span>
    <input bind:value={model.name} class="input variant-form-material" type="text" required />
  </label>

  <label class="label">
    <span>Description</span>
    <textarea bind:value={model.description} class="textarea variant-form-material" rows="4" required />
  </label>

  <div class="grid gap-6 grid-cols-1 sm:grid-cols-[auto_1fr]">
    <div class="flex flex-col justify-center sm:pb-1">
      <span>Calucalted as</span>
      <div>
        <RadioGroup
          rounded="rounded-container-token"
          active="variant-filled-surface"
          hover="hover:variant-soft-surface"
        >
          <RadioItem
            on:click={() => delete model.grams}
            bind:group={model.calculatedAs}
            name="per-product"
            value={MealCalculatedAs.PerProduct}
          >
            Per product
          </RadioItem>
          <RadioItem bind:group={model.calculatedAs} name="per-grams" value={MealCalculatedAs.PerGrams}>
            Per grams
          </RadioItem>
        </RadioGroup>
      </div>
    </div>

    {#if model.calculatedAs === MealCalculatedAs.PerGrams}
      <label class="label sm:mt-1">
        <span>Grams</span>
        <input bind:value={model.grams} class="input variant-form-material" type="number" required />
      </label>
    {/if}
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-2">
    <label class="label">
      <span>Calories</span>
      <input bind:value={model.calories} class="input variant-form-material" type="number" required />
    </label>

    <label class="label">
      <span>Protein</span>
      <input bind:value={model.protein} class="input variant-form-material" type="number" required />
    </label>

    <label class="label">
      <span>Carbs</span>
      <input bind:value={model.carbs} class="input variant-form-material" type="number" required />
    </label>

    <label class="label">
      <span>Fat</span>
      <input bind:value={model.fat} class="input variant-form-material" type="number" required />
    </label>
  </div>

  {#if imagePreview}
    <div class="label">
      <span>Image Preview</span>
      <div
        class="aspect-[21/9] max-w-sm overflow-hidden border-2 border-solid border-surface-500 rounded-container-token relative"
      >
        <button on:click={() => (imagePreview = '')} class="btn-icon variant-filled-secondary absolute top-1 right-1">
          <MaterialSymbolsDeleteOutline />
        </button>

        <img class="w-full" src={imagePreview} alt="Meal Preview" />
      </div>
    </div>
  {:else}
    <div class="grid gap-4 items-center grid-cols-1 xl:grid-cols-[auto_auto_1fr]">
      <FileDropzone class="max-w-sm" on:change={imageUpload} name="meal-image" accept="image/*" title="">
        <svelte:fragment slot="lead">
          <UilImageUpload class="text-3xl mx-auto" />
        </svelte:fragment>
        <svelte:fragment slot="message">Upload an image for this meal (optional)</svelte:fragment>
        <svelte:fragment slot="meta">21/9 aspect for best view</svelte:fragment>
      </FileDropzone>

      <span>or</span>

      <div class="label xl:mb-6">
        <span>Image URL</span>
        <form
          on:submit|preventDefault={imageUrl}
          class="input-group input-group-divider variant-form-material grid-cols-[1fr_auto]"
        >
          <input bind:this={imageUrlInput} type="url" />
          <button type="submit" class="variant-soft-secondary">Preview</button>
        </form>
      </div>
    </div>
  {/if}

  <button type="submit" class="btn variant-ghost-primary max-sm:w-full">Edit Meal</button>
</form>
