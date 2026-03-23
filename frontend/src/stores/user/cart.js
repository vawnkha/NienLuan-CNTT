import { defineStore } from "pinia";
import { computed, ref } from "vue";
import cartService from "@/services/cart.service";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const subtotal = ref(0);
  const loading = ref(false);

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  );

  const cartTotal = computed(() => subtotal.value);

  async function fetchCart(userId) {
    if (!userId) {
      items.value = [];
      subtotal.value = 0;
      return;
    }
    loading.value = true;
    try {
      const data = await cartService.getCart(userId);
      items.value = data.items || [];
      subtotal.value = data.subtotal || 0;
    } finally {
      loading.value = false;
    }
  }

  async function addToCart(userId, productId, quantity = 1) {
    await cartService.addItem(userId, productId, quantity);
    await fetchCart(userId);
  }

  async function updateQuantity(userId, productId, quantity) {
    await cartService.updateItem(userId, productId, quantity);
    await fetchCart(userId);
  }

  async function removeFromCart(userId, productId) {
    await cartService.removeItem(userId, productId);
    await fetchCart(userId);
  }

  async function clearCart(userId) {
    await cartService.clearCart(userId);
    await fetchCart(userId);
  }

  return {
    items,
    subtotal,
    loading,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
});
