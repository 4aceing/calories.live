<script lang="ts">
  export let title: string;
</script>

<div
  class="block overflow-y-auto bg-surface-100-800-token w-modal h-auto p-4 space-y-4 rounded-container-token shadow-xl"
  role="dialog"
  aria-modal="true"
  aria-label={title}
>
  <header class="text-2xl font-bold">
    {title}
    <slot name="title" />
  </header>

  <article class="overflow-hidden">
    <slot name="content" />
  </article>

  <footer class="flex justify-end space-x-2">
    <slot name="actions" />
  </footer>
</div>
