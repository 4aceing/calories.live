<script lang="ts">
  import { FileDropzone, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
  import MaterialSymbolsArrowBackIos from '~icons/material-symbols/arrow-back-ios';
  import UilImageUpload from '~icons/uil/image-upload';
  import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';

  let value = 0;
  let imagePreview = '';
  let imageUrlInput: HTMLInputElement;

  function imageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files![0];

    imagePreview = file ? URL.createObjectURL(file) : '';
  }

  function imageUrl() {
    imagePreview = imageUrlInput.value && imageUrlInput.validity.valid ? imageUrlInput.value : '';
  }
</script>

<a href="/meals" class="btn btn-sm !bg-transparent pl-0 pt-0 mb-4">
  <MaterialSymbolsArrowBackIos class="mr-2" />
  Back to all meals
</a>

<h1 class="text-2xl mb-8">Add new meal for later use</h1>

<form class="space-y-6">
  <label class="label">
    <span>Name</span>
    <input class="input variant-form-material" type="text" />
  </label>

  <label class="label">
    <span>Description</span>
    <textarea class="textarea variant-form-material" rows="4" />
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
          <RadioItem bind:group={value} name="justify" value={0}>Per product</RadioItem>
          <RadioItem bind:group={value} name="justify" value={1}>Per grams</RadioItem>
        </RadioGroup>
      </div>
    </div>

    {#if value === 1}
      <label class="label sm:mt-1">
        <span>Grams</span>
        <input class="input variant-form-material" type="number" />
      </label>
    {/if}
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-2">
    <label class="label">
      <span>Calories</span>
      <input class="input variant-form-material" type="number" />
    </label>

    <label class="label">
      <span>Protein</span>
      <input class="input variant-form-material" type="number" />
    </label>

    <label class="label">
      <span>Carbs</span>
      <input class="input variant-form-material" type="number" />
    </label>

    <label class="label">
      <span>Fat</span>
      <input class="input variant-form-material" type="number" />
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
        <div class="input-group input-group-divider variant-form-material grid-cols-[1fr_auto]">
          <input bind:this={imageUrlInput} type="url" />
          <button on:click={imageUrl} class="variant-soft-secondary">Preview</button>
        </div>
      </div>
    </div>
  {/if}

  <button type="submit" class="btn variant-ghost-primary max-sm:w-full">Add Meal</button>
</form>
