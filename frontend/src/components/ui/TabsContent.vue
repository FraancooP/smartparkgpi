<template>
  <div v-show="isSelected">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabsContent',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  inject: ['selectedTab'],
  computed: {
    isSelected() {
      return this.selectedTab === this.value;
    },
  },
};
</script>