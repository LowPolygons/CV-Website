<script setup lang="ts">
defineProps<{
    name: string
    description: string
    imageUrl: string 
}>()
</script>

<template>
    <div class="bg-neutral-300 dark:bg-neutral-700 border-5 border-neutral-300 dark:border-neutral-700 rounded-xl">
        <h2>
            <ImportantText>
                {{ name }}
            </ImportantText>
        </h2>
        <img class="flex-1 w-[100%] mx-auto rounded-2xl mb-2":src="imageUrl">
        <ImportantText class="text-justify justify-center w-[85%] mx-auto">
            {{  description }}
        </ImportantText>
    </div>
</template>