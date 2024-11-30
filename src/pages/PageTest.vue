
<template>
    Все работает
    <Button label="к поиску" @click="rout.push('/search')"></Button>
</template>

<script setup>

import { useRouter } from 'vue-router';

const rout = useRouter()
</script>