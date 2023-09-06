<script lang="ts">
  import { Autocomplete, popup, type AutocompleteOption, type PopupSettings } from '@skeletonlabs/skeleton';
  import { MealCalculatedAs, type Meal } from '../../types/Meal';
  import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';
  import IconParkOutlineDisabledPicture from '~icons/icon-park-outline/disabled-picture';
  import MdiEyeArrowLeftOutline from '~icons/mdi/eye-arrow-left-outline';
  import { goto } from '$app/navigation';
  import type { TodayMeal } from '../../types/TodayMeal';
  import {
    addTodayMeal,
    deleteTodayMeal,
    finishTodayMeal,
    todayMealsStore,
    updateTodayMealQuantity,
  } from '../../utils/stores/TodayMealsStore';
  import { getMealById, mealsStore } from '../../utils/stores/MealsStore';
  import { confirmModal } from '../../utils/ModalTrigger';
  import { getProgressByDate } from '../../utils/stores/ProgressStore';

  $: todayMeals = $todayMealsStore.map((todayMeal) => {
    const meal = getMealById(todayMeal.id) as TodayMeal;

    meal.quantity = todayMeal.quantity;
    meal.computedCalories = meal.calories;
    meal.computedProtein = meal.protein;
    meal.computedCarbs = meal.carbs;
    meal.computedFat = meal.fat;

    return meal;
  });

  $: todayMeals.forEach((meal) => {
    meal.computedCalories = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.calories}`).toFixed(2);
    meal.computedProtein = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.protein}`).toFixed(2);
    meal.computedCarbs = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.carbs}`).toFixed(2);
    meal.computedFat = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.fat}`).toFixed(2);
  });

  $: total = todayMeals.reduce(
    (data, meal, i) => {
      data.calories += meal.computedCalories;
      data.protein += meal.computedProtein;
      data.carbs += meal.computedCarbs;
      data.fat += meal.computedFat;

      if (i === todayMeals.length - 1) {
        data.calories = +parseFloat(`${data.calories}`).toFixed(2);
        data.protein = +parseFloat(`${data.protein}`).toFixed(2);
        data.carbs = +parseFloat(`${data.carbs}`).toFixed(2);
        data.fat = +parseFloat(`${data.fat}`).toFixed(2);
      }

      return data;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );

  let trackDate = new Date().toISOString().slice(0, 10);
  let inputSearch: string = '';

  let searchMeals = $mealsStore
    .filter((m) => !m.archived)
    .map(
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

    addTodayMeal(meal);
  }

  function updateNutritionalValues(meal: Meal, event: Event) {
    const input = event.target as HTMLInputElement;

    const quantity = +input.value || 0;

    updateTodayMealQuantity(meal.id, quantity);
  }

  function finishDay() {
    const saveDay = () => {
      finishTodayMeal(trackDate, todayMeals);

      goto(`/progress/day?date=${trackDate}`);
    };

    if (getProgressByDate(trackDate)) {
      confirmModal(
        `<p>This day was already tracked</p>
         <p>Do you want to override it?</p>`,
        saveDay,
      );
      return;
    }

    saveDay();
  }
</script>

<h1 class="text-2xl mb-8">Track what you have eaten today</h1>

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

{#if todayMeals.length}
  <div
    class="w-full py-2 px-4 grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 items-center mb-2"
  >
    <div class="flex items-center gap-[1ch]">
      <span>Calories:</span>
      <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${total.calories}`}>
        {total.calories}
      </div>
    </div>

    <div class="flex items-center gap-[1ch]">
      <span>Protein:</span>
      <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${total.protein}`}>
        {total.protein}
      </div>
    </div>

    <div class="flex items-center gap-[1ch]">
      <span>Carbs:</span>
      <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${total.carbs}`}>
        {total.carbs}
      </div>
    </div>

    <div class="flex items-center gap-[1ch]">
      <span>Fat:</span>
      <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${total.fat}`}>
        {total.fat}
      </div>
    </div>
  </div>
{/if}

<section class="flex flex-col gap-4">
  {#each todayMeals as meal, index}
    <div class="card w-full overflow-hidden relative">
      <div class="w-full min-h-[5rem] grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] items-center">
        <div class="grid grid-cols-1 min-[500px]:grid-cols-[auto_auto_1fr] min-[500px]:gap-2 items-center">
          <div
            class="w-full min-[500px]:w-[186px] aspect-[21/9] h-full border-r border-surface-300/50 dark:border-surface-600/50 overflow-hidden bg-surface/50 {meal.imageUrl
              ? ''
              : 'flex items-center justify-center'}"
          >
            {#if meal.imageUrl}
              <img loading="lazy" src={meal.imageUrl} class="w-full" alt={meal.name} />
            {:else}
              <IconParkOutlineDisabledPicture class="text-2xl opacity-50" />
            {/if}
          </div>

          <hr class="opacity-50 min-[500px]:hidden" />

          <span
            class="text-left text-xl overflow-hidden whitespace-nowrap overflow-ellipsis mr-4 max-[499px]:py-2 max-[499px]:ml-4"
            title={meal.name}
          >
            {meal.name}
          </span>
        </div>

        <hr class="opacity-50 xl:hidden" />

        <div class="flex gap-4 ml-auto mr-4 items-center max-xl:py-4">
          <div class="max-[499px]:ml-4 flex items-center gap-4">
            <span>Quantity:</span>
            {#if meal.calculatedAs === MealCalculatedAs.PerProduct}
              <input
                on:input={(e) => updateNutritionalValues(meal, e)}
                type="number"
                class="input w-40 max-[499px]:w-full"
                min="1"
                bind:value={meal.quantity}
              />
            {:else}
              <div class="input-group input-group-divider grid-cols-[1fr_auto] w-40 max-[499px]:w-full">
                <input
                  on:input={(e) => updateNutritionalValues(meal, e)}
                  type="number"
                  class="input"
                  min="1"
                  bind:value={meal.quantity}
                />
                <div class="input-group-shim !pl-3">g</div>
              </div>
            {/if}
          </div>

          <div class="flex gap-2 max-[499px]:absolute max-[499px]:top-1 max-[499px]:right-1">
            <button
              on:click={() => goto(`/meals?search=${meal.name}`)}
              class="btn-icon variant-filled-secondary"
              title="View Meal"
            >
              <MdiEyeArrowLeftOutline />
            </button>

            <button on:click={() => deleteTodayMeal(meal)} class="btn-icon variant-filled-error" title="Exclude Meal">
              <MaterialSymbolsDeleteOutline />
            </button>
          </div>
        </div>
      </div>

      <hr class="opacity-50" />

      <div
        class="w-full py-2 px-4 grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 items-center"
      >
        <div class="flex items-center gap-[1ch]">
          <span>Calories:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.computedCalories}`}>
            {meal.computedCalories}
          </div>
        </div>

        <div class="flex items-center gap-[1ch]">
          <span>Protein:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.computedProtein}`}>
            {meal.computedProtein}
          </div>
        </div>

        <div class="flex items-center gap-[1ch]">
          <span>Carbs:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.computedCarbs}`}>
            {meal.computedCarbs}
          </div>
        </div>

        <div class="flex items-center gap-[1ch]">
          <span>Fat:</span>
          <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${meal.computedFat}`}>
            {meal.computedFat}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <p>No meals tracked for today</p>
  {/each}
</section>

{#if todayMeals.length}
  <label class="label mt-6">
    <span>Day of tracking (defaults to today)</span>
    <input type="date" class="input variant-form-material" bind:value={trackDate} />
  </label>

  <button on:click={finishDay} type="button" class="btn variant-ghost-primary max-sm:w-full mt-6">Finish day</button>
{/if}
