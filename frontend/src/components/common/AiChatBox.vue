<script setup>
import { nextTick, ref, onBeforeUnmount } from "vue";
import aiService from "@/services/ai.service";
import { useRouter } from "vue-router";

const router = useRouter();

const opened = ref(false);
const loading = ref(false);
const input = ref("");
const bodyRef = ref(null);

const debounceTimer = ref(null);
const lastSentText = ref("");

const messages = ref([
  {
    role: "assistant",
    text: "Xin chào 👋 Mình có thể giúp bạn tìm sản phẩm, hỏi giá, hoặc gợi ý sản phẩm có trên website.",
    products: [],
  },
]);

function toggleChat() {
  opened.value = !opened.value;
}

async function scrollToBottom() {
  await nextTick();
  if (bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  }
}

function openProduct(product) {
  router.push(`/products/${product._id}`);
}

function clearDebounceTimer() {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
    debounceTimer.value = null;
  }
}

function handleInput() {
  clearDebounceTimer();

  const text = input.value.trim();
  if (!text) return;

  debounceTimer.value = setTimeout(() => {
    debounceTimer.value = null;
  }, 5000);
}

async function sendMessage() {
  const text = input.value.trim();

  if (!text || loading.value) return;

  if (text === lastSentText.value) return;

  clearDebounceTimer();

  messages.value.push({
    role: "user",
    text,
    products: [],
  });

  input.value = "";
  loading.value = true;
  lastSentText.value = text;

  await scrollToBottom();

  try {
    const res = await aiService.chat(text);

    messages.value.push({
      role: "assistant",
      text: res.reply || "Mình chưa có câu trả lời phù hợp.",
      products: res.products || [],
    });
  } catch (error) {
    messages.value.push({
      role: "assistant",
      text:
        error?.response?.data?.message ||
        "Xin lỗi, hiện tại chat AI đang gặp lỗi.",
      products: [],
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

function handleEnter(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function handleFocus() {
  clearDebounceTimer();
}

onBeforeUnmount(() => {
  clearDebounceTimer();
});
</script>

<template>
  <div class="ai-chat">
    <button class="ai-chat__toggle" @click="toggleChat">
      <i class="fa-solid fa-comment"></i>
    </button>

    <div v-if="opened" class="ai-chat__panel">
      <div class="ai-chat__header">
        <div>
          <strong>Hỗ Trợ Trực Tuyến</strong>
          <div class="ai-chat__sub">Hỏi giá hoặc tìm sản phẩm</div>
        </div>
        <button class="ai-chat__close" @click="toggleChat">×</button>
      </div>

      <div ref="bodyRef" class="ai-chat__body">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="ai-chat__msg"
          :class="msg.role"
        >
          <div class="ai-chat__bubble">
            {{ msg.text }}
          </div>

          <div
            v-if="msg.products && msg.products.length"
            class="ai-chat__products"
          >
            <div
              v-for="product in msg.products"
              :key="product._id"
              class="ai-chat__product"
              @click="openProduct(product)"
            >
              <img
                :src="product.thumbnail"
                alt=""
                class="ai-chat__product-thumb"
              />
              <div class="ai-chat__product-info">
                <div class="ai-chat__product-name">{{ product.name }}</div>
                <div class="ai-chat__product-price">
                  {{ Number(product.price || 0).toLocaleString("vi-VN") }} VND
                </div>
                <div class="ai-chat__product-stock">
                  {{ Number(product.stock) > 0 ? "Còn hàng" : "Hết hàng" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="ai-chat__msg assistant">
          <div class="ai-chat__bubble">Đang trả lời...</div>
        </div>
      </div>

      <div class="ai-chat__footer">
        <textarea
          v-model="input"
          class="ai-chat__input"
          rows="2"
          placeholder="Ví dụ: giá thịt bò bao nhiêu?"
          @input="handleInput"
          @focus="handleFocus"
          @keydown="handleEnter"
        ></textarea>

        <button class="ai-chat__send" :disabled="loading" @click="sendMessage">
          Gửi
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.ai-chat {
  position: fixed;
  top: 580px;
  right: 5px;
  z-index: 4000;
}

.ai-chat__toggle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 0;
  background: #78b144;
  color: #fff;
  font-size: 22px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.ai-chat__panel {
  position: absolute;
  right: 70px;
  bottom: 50px;
  width: 360px;
  height: 520px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
}

.ai-chat__header {
  background: #78b144;
  color: #fff;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-chat__sub {
  font-size: 12px;
  opacity: 0.9;
}

.ai-chat__close {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 24px;
}

.ai-chat__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: #f7fafc;
}

.ai-chat__msg {
  margin-bottom: 12px;
}

.ai-chat__msg.user {
  text-align: right;
}

.ai-chat__bubble {
  display: inline-block;
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.ai-chat__msg.user .ai-chat__bubble {
  background: #78b144;
  color: #fff;
}

.ai-chat__msg.assistant .ai-chat__bubble {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.ai-chat__products {
  margin-top: 8px;
  display: grid;
  gap: 8px;
}

.ai-chat__product {
  display: flex;
  gap: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
}

.ai-chat__product-thumb {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
}

.ai-chat__product-info {
  flex: 1;
  min-width: 0;
}

.ai-chat__product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.ai-chat__product-price {
  font-size: 13px;
  color: #dc2626;
}

.ai-chat__product-stock {
  font-size: 12px;
  color: #64748b;
}

.ai-chat__footer {
  border-top: 1px solid #e2e8f0;
  padding: 10px;
  background: #fff;
}

.ai-chat__input {
  width: 100%;
  resize: none;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  outline: none;
  font-size: 14px;
}

.ai-chat__send {
  width: 100%;
  margin-top: 8px;
  border: 0;
  background: #78b144;
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
}

.ai-chat__send:disabled {
  opacity: 0.6;
}
</style>
