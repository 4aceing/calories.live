<script lang="ts">
  import MealCardActions from '../../components/MealCardActions.svelte';
  import IconParkOutlineDisabledPicture from '~icons/icon-park-outline/disabled-picture';
  import { MealCalculatedAs } from '../../types/Meal';
  import { deleteMeal, mealsStore } from '../../utils/stores/MealsStore';
  import { deleteMealImage, getMealImage } from '../../utils/IndexedDb';

  export let data;

  let searchValue = data.search || '';

  $: filteredMeals = $mealsStore
    .filter((m) => !m.archived)
    .filter((meal) => meal.name.includes(searchValue) || meal.description.includes(searchValue));

  function deleteMealFromList(id: string) {
    deleteMeal(id);

    deleteMealImage(id);
  }
</script>

<h1 class="text-2xl mb-8">Find all of your saved meals</h1>

<div class="grid sm:grid-cols-[1fr_auto] gap-4 mb-8">
  <input bind:value={searchValue} type="search" class="input" placeholder="Search..." />
  <a href="/meals/new" class="btn variant-ghost-primary">Add New Meal</a>
</div>

<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {#each filteredMeals as meal}
    <div class="card overflow-hidden flex flex-col relative">
      <div class="absolute top-1 right-1">
        <MealCardActions {meal} on:delete={() => deleteMealFromList(meal.id)} />
      </div>

      <header
        class="aspect-[21/9] overflow-hidden bg-surface/50 {meal.imageUrl ? '' : 'flex items-center justify-center'}"
      >
        <!-- {#await getMealImage(meal.id)}
          <IconParkOutlineDisabledPicture class="text-4xl opacity-50" />
        {:then base64Image}
          {#if base64Image}
            <img loading="lazy" src={base64Image} class="w-full" alt={meal.name} />
          {:else}
            <IconParkOutlineDisabledPicture class="text-4xl opacity-50" />
          {/if}
        {:catch error}
          <IconParkOutlineDisabledPicture class="text-4xl opacity-50" />
        {/await} -->
        {#if meal.imageUrl}
          <img loading="lazy" src={meal.imageUrl} class="w-full" alt={meal.name} />
        {:else}
          <IconParkOutlineDisabledPicture class="text-4xl opacity-50" />
        {/if}
      </header>

      <hr class="opacity-50" />

      <div class="p-4 space-y-4">
        <h3 class="h3 max-h-40 overflow-y-auto">{meal.name}</h3>

        <article>
          <p class="max-h-52 overflow-y-auto">{meal.description}</p>

          <section class="mt-4">
            <div class="mb-2">
              {meal.calculatedAs === MealCalculatedAs.PerProduct ? 'Per product' : `Per ${meal.grams}g`}
            </div>
            <div class="flex items-center gap-2">
              Calories: {Math.ceil(meal.calories)}
              <!-- <span class="text-sm opacity-75" title="Calculated calories">
                ({Math.ceil(meal.calculatedCalories)})
              </span> -->
            </div>
            <div>Protein: {meal.protein}</div>
            <div>Carbs: {meal.carbs}</div>
            <div>Fat: {meal.fat}</div>
          </section>
        </article>
      </div>

      <hr class="opacity-50 mt-auto" />

      <footer class="p-4 flex justify-end items-center space-x-4">
        <small>Added on {new Date(meal.createdAtTimestamp).toLocaleDateString()}</small>
      </footer>
    </div>
  {:else}
    <p>No meals found</p>
  {/each}
</section>
