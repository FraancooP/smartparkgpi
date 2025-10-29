<template>
  <Card class="relative">
    <CardContent class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">{{ title }}</span>
        <i :class="['fas', icon, 'text-lg text-gray-400']"></i>
      </div>
      <div class="text-2xl font-bold">{{ value }}</div>
    </CardContent>
  </Card>
</template>

<script>
import Card from './Card.vue';
import CardContent from './CardContent.vue';

export default {
  name: 'StatCard',
  components: {
    Card,
    CardContent,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>