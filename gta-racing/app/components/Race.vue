<script setup lang="ts">
defineProps<{
    name: string
    imageUrl: string 
}>()
</script>

<template>
    <div class="bg-neutral-800 border-5 border-neutral-800">
        <h2>
            <ImportantText>
                {{ name }}
            </ImportantText>
        </h2>
        <img class="mx-auto":src="imageUrl">
    </div>
</template>