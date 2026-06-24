<script setup lang="ts">
defineProps<{
    name: string
    imageUrl: string 
}>()
</script>

<template>
    <div class="bg-gray-800 border-5 border-gray-800">
        <h2>
            <ImportantText>
                {{ name }}
            </ImportantText>
        </h2>
        <img :src="imageUrl">
    </div>
</template>