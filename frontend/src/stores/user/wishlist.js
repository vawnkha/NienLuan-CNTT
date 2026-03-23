import { defineStore } from "pinia";
import { computed, ref } from "vue";
import wishlistService from "@/services/wishlist.service";

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref([]);
  const loading = ref(false);

  const wishlishCount = computed(() => items.value.length);

  function isInWishlist(productId) {
    return items.value.some(
      (item) => String(item._id || item.id) === String(productId),
    );
  }

  async function fetchWishlist(userId) {
    if (!userId) {
      items.value = [];
      return;
    }
    loading.value = true;
    try {
      const data = await wishlistService.getByUser(userId);
      items.value = data.products || [];
    } finally {
      loading.value = false;
    }
  }

  async function toggleWishlist(userId, productId) {
    const result = await wishlistService.toggleItem(userId, productId);
    items.value = result.data?.products || [];
    return result;
  }

  async function removeFromWishlist(userId, productId) {
    const result = await wishlistService.removeItem(userId, productId);
    items.value = result.data?.products || [];
    return result;
  }

  async function clearWishlist(userId) {
    const result = await wishlistService.clear(userId);
    items.value = result.data?.products || [];
    return result;
  }

  return {
    items,
    loading,
    wishlishCount,
    isInWishlist,
    fetchWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };
});
