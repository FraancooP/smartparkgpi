<template>
  <div class="w-full" :class="class">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    defaultValue: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      default: '',
    },
  },
  provide() {
    return {
      selectedTab: this.defaultValue,
    };
  },
};
</script>