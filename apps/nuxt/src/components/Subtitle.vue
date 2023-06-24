<template>
   <Text :style="style">
          Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo
          D. Quijote de la Mancha
   </Text>
</template>
<script setup>
import { Text } from "./tags"

import { defineProps} from 'vue'

defineProps({
    style: {}
})
</script>