<script lang="ts">
  import type { Meal } from '../../types/Meal';
  import { getMealById } from '../../utils/stores/MealsStore';
  import { progressStore } from '../../utils/stores/ProgressStore';

  $: avgMacros = $progressStore.reduce(
    (total, day, i) => {
      const dayMacros = day.meals.reduce(
        (mealTotal, todayMeal) => {
          const meal = getMealById(todayMeal.id) as Meal;
          const ratio = todayMeal.quantity / (meal.grams || 1);
          mealTotal.calories += ratio * meal.calories;
          mealTotal.protein += ratio * meal.protein;
          mealTotal.carbs += ratio * meal.carbs;
          mealTotal.fat += ratio * meal.fat;

          return mealTotal;
        },
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      );

      total.calories += dayMacros.calories;
      total.protein += dayMacros.protein;
      total.carbs += dayMacros.carbs;
      total.fat += dayMacros.fat;

      if (i === $progressStore.length - 1) {
        total.calories = +parseFloat(`${total.calories / $progressStore.length}`).toFixed(2);
        total.protein = +parseFloat(`${total.protein / $progressStore.length}`).toFixed(2);
        total.carbs = +parseFloat(`${total.carbs / $progressStore.length}`).toFixed(2);
        total.fat = +parseFloat(`${total.fat / $progressStore.length}`).toFixed(2);
      }

      return total;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );
</script>

<h1 class="text-2xl mb-8">View your progress</h1>

{#if $progressStore.length}
  <div class="space-y-2 mb-8">
    <span class="text-lg">Average values</span>
    <div class="w-full grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 items-center mb-2">
      <div class="flex items-center gap-[1ch]">
        <span>Calories:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${avgMacros.calories}`}>
          {avgMacros.calories}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Protein:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${avgMacros.protein}`}>
          {avgMacros.protein}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Carbs:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${avgMacros.carbs}`}>
          {avgMacros.carbs}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Fat:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${avgMacros.fat}`}>
          {avgMacros.fat}
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="flex flex-wrap items-center gap-4">
  {#each $progressStore as day}
    <a href="/progress/day?date={day.date}" class="btn variant-filled-surface">{day.date}</a>
  {:else}
    <p>No days saved</p>
  {/each}
</div>
