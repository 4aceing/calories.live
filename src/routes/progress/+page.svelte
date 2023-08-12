<script lang="ts">
  import { storeProgress } from '../../utils/LocalStorage';

  const average = {
    calories: 100,
    protein: 100,
    carbs: 100,
    fat: 100,
  };
</script>

<h1 class="text-2xl mb-8">View your progress</h1>

{#if $storeProgress.length}
  <div class="space-y-2 mb-8">
    <span class="text-lg">Average values</span>
    <div class="w-full grid grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2 items-center mb-2">
      <div class="flex items-center gap-[1ch]">
        <span>Calories:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${average.calories}`}>
          {average.calories}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Protein:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${average.protein}`}>
          {average.protein}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Carbs:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${average.carbs}`}>
          {average.carbs}
        </div>
      </div>

      <div class="flex items-center gap-[1ch]">
        <span>Fat:</span>
        <div class="overflow-hidden whitespace-nowrap overflow-ellipsis" title={`${average.fat}`}>
          {average.fat}
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="flex flex-wrap items-center gap-4">
  {#each $storeProgress as day}
    <a href="/progress/day?date={day.day}" class="btn variant-filled-surface">{day.day}</a>
  {:else}
    <p>No days saved</p>
  {/each}
</div>
