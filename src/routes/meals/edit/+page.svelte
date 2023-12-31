<script lang="ts">
  import { FileDropzone, RadioGroup, RadioItem, toastStore } from '@skeletonlabs/skeleton';
  import MaterialSymbolsArrowBackIos from '~icons/material-symbols/arrow-back-ios';
  import UilImageUpload from '~icons/uil/image-upload';
  import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';
  import { MealCalculatedAs, type Meal } from '../../../types/Meal';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { errorToast } from '../../../utils/ToastTrigger';
  import { getMealById, getMealByName, mealsStore, updateMeal } from '../../../utils/stores/MealsStore';
  import { fileToBase64, imageUrlToBase64, resizeBase64Image } from '../../../utils/ImageProcess';
  import { addMealImage, deleteMealImage } from '../../../utils/IndexedDb';

  export let data;

  const mealId = data.id || '';

  const model = getMealById(mealId) || ({} as Meal);

  const initialName = model.name;

  let imagePreview = model.imageUrl || '';
  let imageUrlInput: HTMLInputElement;

  onMount(() => {
    if (!getMealById(mealId)) {
      errorToast('Meal was not found for editing');

      goto('/meals');
    }
  });

  async function imageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files![0];

    imagePreview = await resizeBase64Image(await fileToBase64(file), 560, 240);
  }

  async function imageUrl() {
    if (!imageUrlInput.value || !imageUrlInput.validity.valid) {
      imagePreview = '';
      return;
    }

    imagePreview = await resizeBase64Image(await imageUrlToBase64(imageUrlInput.value), 560, 240);
  }

  async function editMeal() {
    if (initialName !== model.name && getMealByName(model.name)) {
      errorToast(`A meal named '${model.name}' already exists`);

      return;
    }

    model.imageUrl = imagePreview || undefined;

    updateMeal(model);

    if (imagePreview) {
      await addMealImage(model.id, model.name, imagePreview);
    } else {
      deleteMealImage(model.id);
    }

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
      <input bind:value={model.protein} class="input variant-form-material" type="number" required step="any" />
    </label>

    <label class="label">
      <span>Carbs</span>
      <input bind:value={model.carbs} class="input variant-form-material" type="number" required step="any" />
    </label>

    <label class="label">
      <span>Fat</span>
      <input bind:value={model.fat} class="input variant-form-material" type="number" required step="any" />
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
