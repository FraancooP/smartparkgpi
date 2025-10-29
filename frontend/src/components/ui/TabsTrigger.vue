<template>
  <button
    class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    :class="{ 'bg-white text-gray-900 shadow-sm': isSelected, 'text-gray-500 hover:text-gray-900': !isSelected }"
    @click="selectTab"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'TabsTrigger',
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
  methods: {
    selectTab() {
      this.$parent.$parent.selectedTab = this.value;
    },
  },
};
</script>