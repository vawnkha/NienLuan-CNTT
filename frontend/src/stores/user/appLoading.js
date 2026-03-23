import { ref } from "vue";
const isPageLoading = ref(false);

export function useAppLoading() {
  const showLoading = () => {
    isPageLoading.value = true;
  };

  const hideLoading = () => {
    isPageLoading.value = false;
  };

  return {
    isPageLoading,
    showLoading,
    hideLoading,
  };
}
