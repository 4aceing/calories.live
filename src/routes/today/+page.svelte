<script lang="ts">
  import { Autocomplete, popup, type AutocompleteOption, type PopupSettings, toastStore } from '@skeletonlabs/skeleton';
  import { storeMeals, storeTodayMeals } from '../../utils/LocalStorage';
  import { MealCalculatedAs, type Meal } from '../../types/Meal';
  import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';
  import IconParkOutlineDisabledPicture from '~icons/icon-park-outline/disabled-picture';
  import MdiEyeArrowLeftOutline from '~icons/mdi/eye-arrow-left-outline';
  import { goto } from '$app/navigation';

  let inputSearch: string = '';

  const maxChars = $storeTodayMeals.reduce(
    (data, meal) => {
      data.calories = Math.min(Math.max(`${meal.calories}`.length, data.calories), 10);
      data.protein = Math.min(Math.max(`${meal.protein}`.length, data.protein), 10);
      data.carbs = Math.min(Math.max(`${meal.carbs}`.length, data.carbs), 10);
      data.fat = Math.min(Math.max(`${meal.fat}`.length, data.fat), 10);

      return data;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );

  let searchMeals = $storeMeals.map(
    (meal) =>
      ({
        label: meal.name,
        value: meal,
      } as AutocompleteOption),
  );

  let popupSeachMeal: PopupSettings = {
    event: 'focus-click',
    target: 'popupSeachMeal',
    placement: 'bottom',
  };

  function includeMeal(event: CustomEvent<AutocompleteOption>) {
    const meal = event.detail.value as Meal;

    storeTodayMeals.update((meals) => {
      meals.push(meal);
      return meals;
    });

    toastStore.trigger({
      message: `Included '${meal.name}' into today's list of meals`,
      background: 'variant-soft-success',
    });
  }

  function excludeMeal(meal: Meal, index: number) {
    storeTodayMeals.update((meals) => {
      meals.splice(index, 1);
      return meals;
    });

    toastStore.trigger({
      message: `Excluded '${meal.name}' from today's list of meals`,
      background: 'variant-soft-warning',
    });
  }

  function viewMeal(meal: Meal) {
    goto(`/meals?search=${meal.name}`);
  }
</script>

<h1 class="text-2xl mb-8">Track what have you eaten today</h1>

<div class="text-token w-full space-y-2 relative mb-8">
  <span>You can search and include a meal</span>
  <input
    class="input autocomplete"
    type="search"
    name="autocomplete-search"
    bind:value={inputSearch}
    placeholder="Search..."
    use:popup={popupSeachMeal}
  />

  <div class="card w-full max-h-48 p-4 overflow-y-auto z-10" tabindex="-1" data-popup="popupSeachMeal">
    <Autocomplete bind:input={inputSearch} options={searchMeals} on:selection={includeMeal} />
  </div>
</div>

<section class="flex flex-col gap-4">
  {#each $storeTodayMeals as meal, index}
    <div class="card w-full overflow-hidden">
      <div class="w-full h-20 grid grid-cols-[auto_1fr_auto_auto_auto] items-center">
        <div
          class="w-[186px] aspect-[21/9] h-full border-r border-surface-300/50 dark:border-surface-600/50 overflow-hidden bg-surface/50 {meal.imageUrl
            ? ''
            : 'flex items-center justify-center'}"
        >
          {#if meal.imageUrl}
            <img loading="lazy" src={meal.imageUrl} class="w-full" alt={meal.name} />
          {:else}
            <IconParkOutlineDisabledPicture class="text-2xl opacity-50" />
          {/if}
        </div>

        <span class="ml-4 text-xl overflow-hidden whitespace-nowrap overflow-ellipsis" title={meal.name}>
          {meal.name}
        </span>

        <div class="flex items-center gap-4 ml-8 mr-8">
          <span>Quantity:</span>
          {#if meal.calculatedAs === MealCalculatedAs.PerProduct}
            <input type="number" class="input w-28" value={1} />
          {:else}
            <div class="input-group input-group-divider grid-cols-[1fr_auto] w-28">
              <input type="number" class="input" value={meal.grams} />
              <div class="input-group-shim !pl-3">g</div>
            </div>
          {/if}
        </div>

        <button on:click={() => viewMeal(meal)} class="btn-icon variant-soft-secondary ml-auto mr-4" title="View Meal">
          <MdiEyeArrowLeftOutline />
        </button>

        <button on:click={() => excludeMeal(meal, index)} class="btn-icon variant-soft-error mr-4" title="Exclude Meal">
          <MaterialSymbolsDeleteOutline />
        </button>
      </div>

      <hr class="opacity-50" />

      <div class="w-full h-10 grid grid-cols-4 items-center">
        <div class="ml-4 flex items-center gap-[1ch]">
          <span>Calories:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.calories}`}>
            {meal.calories}
          </div>
        </div>

        <div class="ml-8 flex items-center gap-[1ch]">
          <span>Protein:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.protein}`}>
            {meal.protein}
          </div>
        </div>

        <div class="ml-8 flex items-center gap-[1ch]">
          <span>Carbs:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.carbs}`}>
            {meal.carbs}
          </div>
        </div>

        <div class="ml-8 flex items-center gap-[1ch]">
          <span>Fat:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.fat}`}>
            {meal.fat}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <p>No meals tracked for today</p>
  {/each}
</section>
