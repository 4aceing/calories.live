<script lang="ts">
  import { toastStore } from '@skeletonlabs/skeleton';
  import MealCardActions from '../../components/MealCardActions.svelte';

  let meals = [
    {
      id: 1,
      name: 'egg',
      description: 'fried chicken egg',
      quantifier: 1,
      kcal: 90,
      protein: 6.25,
      fats: 6.75,
      carbs: 0.5,
    },
    {
      id: 2,
      name: 'milk',
      description: '333ml zuzu 1.5% fat',
      quantifier: 333,
      kcal: 147,
      protein: 10.32,
      fats: 5,
      carbs: 15,
    },
  ];
  meals.push(...meals);
  meals.push(...meals);
  meals.push(...meals);

  let searchValue = '';

  $: filteredMeals = meals.filter((meal) => meal.name.includes(searchValue) || meal.description.includes(searchValue));

  function deleteMeal(meal: any, index: number) {
    meals.splice(index, 1);

    meals = [...meals];

    toastStore.trigger({
      message: `Meal '${meal.name}' was deleted`,
      background: 'variant-soft-warning',
    });
  }
</script>

<h1 class="text-2xl mb-8">Here you can find all of your saved meals</h1>

<div class="grid sm:grid-cols-[1fr_auto] gap-4 mb-8">
  <input bind:value={searchValue} type="search" class="input" placeholder="Search..." />
  <a href="/meals/new" class="btn variant-ghost-primary">Add New Meal</a>
</div>

<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {#each filteredMeals as meal, index}
    <div class="card overflow-hidden flex flex-col relative">
      <div class="absolute top-1 right-1">
        <MealCardActions {meal} on:delete={() => deleteMeal(meal, index)} />
      </div>

      <header class="aspect-[21/9] overflow-hidden">
        <img
          loading="lazy"
          src="https://kmph.com/resources/media2/16x9/full/1015/center/80/6b7a7c7c-3c44-489c-9880-4a17508cdc6d-large16x9_Postworkout_meal.jpg"
          class="bg-black/50 w-full"
          alt="Image {meal.name}"
        />
      </header>

      <div class="p-4 space-y-4">
        <h3 class="h3">{meal.name}</h3>

        <article>
          <p>{meal.description}</p>

          <section class="mt-4">
            <div>Calories: {meal.kcal}</div>
            <div>Protein: {meal.protein}</div>
            <div>Carbs: {meal.carbs}</div>
            <div>Fat: {meal.fats}</div>
          </section>
        </article>
      </div>

      <hr class="opacity-50 mt-auto" />

      <footer class="p-4 flex justify-end items-center space-x-4">
        <small>Added on {new Date().toLocaleDateString()}</small>
      </footer>
    </div>
  {:else}
    <p>No meals found</p>
  {/each}
</section>
