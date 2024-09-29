<template>
       <Text>
         hola
        AQUI amir
        <span :style="{color: 'white'}">
            {{ text }}
        </span>
       </Text>
      
</template>
<script setup>
import { Text } from './Elements'

defineProps({
    text: String
})
</script>
