<script lang="ts">
  import { onMount } from 'svelte';
  import { deleteProgressDay, getProgressByDate } from '../../../utils/stores/ProgressStore.js';
  import { errorToast } from '../../../utils/ToastTrigger.js';
  import { goto } from '$app/navigation';
  import type { StoredProgress, TodayMealWithFallback } from '../../../types/Progress.js';
  import { getMealById } from '../../../utils/stores/MealsStore.js';
  import type { TodayMeal } from '../../../types/TodayMeal.js';
  import { MealCalculatedAs } from '../../../types/Meal.js';
  import IconParkOutlineDisabledPicture from '~icons/icon-park-outline/disabled-picture';
  import MdiEyeArrowLeftOutline from '~icons/mdi/eye-arrow-left-outline';
  import { confirmModal } from '../../../utils/ModalTrigger.js';
  import { addTodayMeal, todayMealsStore } from '../../../utils/stores/TodayMealsStore.js';

  export let data;

  const date = data.date as string;

  const day = getProgressByDate(date) || ({ meals: [] as TodayMealWithFallback[] } as StoredProgress);

  const meals = day.meals.map((dayMeal) => {
    const meal = getMealById(dayMeal.id) as TodayMeal;

    meal.quantity = dayMeal.quantity;
    meal.computedCalories = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.calories}`).toFixed(2);
    meal.computedProtein = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.protein}`).toFixed(2);
    meal.computedCarbs = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.carbs}`).toFixed(2);
    meal.computedFat = +parseFloat(`${(meal.quantity / (meal.grams || 1)) * meal.fat}`).toFixed(2);

    return meal;
  });

  const total = meals.reduce(
    (data, meal, i) => {
      data.calories += meal.computedCalories;
      data.protein += meal.computedProtein;
      data.carbs += meal.computedCarbs;
      data.fat += meal.computedFat;

      if (i === meals.length - 1) {
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

  onMount(() => {
    if (!getProgressByDate(date)) {
      errorToast('This day is not tracked');

      goto('/progress');
    }
  });

  function populateTodaysPage() {
    confirmModal(
      `<p>You wish to override today's page with this day's meals?</p>
       <p>Any meals that were deleted after this day was saved won't be transfered</p>`,
      () => {
        todayMealsStore.set([]);

        meals
          .filter((m) => !m.archived)
          .forEach((m) => {
            addTodayMeal(m);
          });

        goto('/today');
      },
    );
  }

  function deleteDay() {
    confirmModal(`<p>Are you sure you want to delete this day '${date}'?</p>`, () => {
      deleteProgressDay(date);

      goto('/progress');
    });
  }
</script>

<h1 class="text-2xl mb-8">Meals tracked for day '{date}'</h1>

{#if meals.length}
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
  {#each meals as meal}
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
            <span>{meal.quantity}{meal.calculatedAs === MealCalculatedAs.PerGrams ? 'g' : ''}</span>
          </div>

          <div class="flex gap-2 max-[499px]:absolute max-[499px]:top-1 max-[499px]:right-1">
            <button
              on:click={() => goto(`/meals?search=${meal.name}`)}
              class="btn-icon variant-filled-secondary"
              title={meal.archived
                ? 'Cannot view meal due to it being deleted at one point after this day was saved'
                : 'View Meal'}
              disabled={meal.archived}
            >
              <MdiEyeArrowLeftOutline />
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
    <p>No meals</p>
  {/each}
</section>

{#if meals.length}
  <button
    on:click={populateTodaysPage}
    type="button"
    class="btn variant-ghost-primary max-sm:w-full mt-6 mr-4 whitespace-normal"
  >
    Populate today's page with this day
  </button>
  <button on:click={deleteDay} type="button" class="btn variant-ghost-error max-sm:w-full mt-6">Delete day</button>
{/if}
