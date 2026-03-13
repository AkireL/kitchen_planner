<script setup lang="ts">
import { ref } from 'vue';
import { KITCHEN_API_URL } from '@/config';
import { useUserStore } from '@/composables/userStore';

interface IMessage {
  from: string;
  text: string;
}

const userStore = useUserStore();
const messages = ref<IMessage[]>([]);
const input = ref<string>('');
const streaming = ref<boolean>(false);

async function sendMessage() {
  if (!input.value.trim() || streaming.value) return;

  messages.value.push({ from: 'usuario', text: input.value });

  messages.value.push({ from: 'servidor', text: '' });

  streaming.value = true;
  const lastMessage = messages.value[messages.value.length - 1];

  const response = await fetch(KITCHEN_API_URL + '/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userStore.getToken(),
    },
    body: JSON.stringify({ message: input.value }),
  });

  input.value = '';

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split('\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;

      const data = line.slice(6);
      if (data === '[DONE]') {
        streaming.value = false;
        break;
      }

      lastMessage.text += data;
    }
  }
}
</script>

<template>
  <div>
    <div v-for="(msg, i) in messages" :key="i">
      <b>{{ msg.from }}:</b> {{ msg.text }}
    </div>

    <input
      v-model="input"
      @keydown.enter="sendMessage"
      placeholder="Escribe algo... (prueba: hola, lunes, martes)"
      :disabled="streaming"
    />
    <button @click="sendMessage" :disabled="streaming">Enviar</button>
  </div>
</template>
