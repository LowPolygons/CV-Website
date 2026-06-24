<script setup lang="ts">
defineProps<{
    name: string
    imageUrl: string 
}>()
</script>

<template>
    <div>
        <h1>Race Name: {{ name }}</h1>
        <img :src="imageUrl">
    </div>
</template>