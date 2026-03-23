<script setup>
defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  activeTap: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["change-tab"]);

function handleClick(tabKey) {
  emit("change-tab", tabKey);
}
</script>
<template>
  <div class="profile-sidebar">
    <div
      v-for="item in menuItems"
      :key="item.key"
      class="profile-menu-item"
      :class="{ active: activeTap === item.key }"
      @click="handleClick(item.key)"
    >
      <span>{{ item.label }}</span>
      <i :class="item.icon"></i>
    </div>
  </div>
</template>
