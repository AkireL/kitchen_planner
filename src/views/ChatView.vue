<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { KITCHEN_API_URL } from '@/config';
import { useUserStore } from '@/composables/userStore';
import { VBtn, VCard, VCardText, VCardTitle, VDivider, VTextarea } from 'vuetify/components';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'streaming' | 'done' | 'error';
  prompt?: string;
}

interface ChatSession {
  threadId: number;
  messages: ChatMessage[];
}

interface StreamPayload {
  type: 'message' | 'error';
  chat_id: number;
  sequence?: number;
  content?: string;
  message?: string;
}

const userStore = useUserStore();
const input = ref('');
const streaming = ref(false);
const messages = ref<ChatMessage[]>([]);
const threadId = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const CHAT_TIMEOUT_MS = 30_000;

function ensureUserLoaded() {
  if (!userStore.getUser()) {
    userStore.isAuthenticated();
  }
}

const currentUserKey = computed(() => {
  ensureUserLoaded();
  const user = userStore.getUser();
  return user?.id || user?.email || user?.username || 'anonymous';
});

const storageKey = computed(() => `chat_session:${currentUserKey.value}`);

function createThreadId() {
  return Date.now();
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createAbortError() {
  return new DOMException('Request timed out.', 'AbortError');
}

function getInitialSession(): ChatSession {
  return {
    threadId: createThreadId(),
    messages: [],
  };
}

function readSession(): ChatSession {
  const raw = localStorage.getItem(storageKey.value);

  if (!raw) {
    return getInitialSession();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ChatSession>;
    const parsedThreadId = Number(parsed.threadId);
    const parsedMessages = Array.isArray(parsed.messages) ? parsed.messages : [];

    return {
      threadId: Number.isFinite(parsedThreadId) ? parsedThreadId : createThreadId(),
      messages: parsedMessages
        .filter((message): message is ChatMessage => {
          return (
            typeof message === 'object' &&
            message !== null &&
            typeof message.id === 'string' &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.text === 'string'
          );
        })
        .map((message) => ({
          ...message,
          status: message.role === 'assistant' ? message.status || 'done' : undefined,
        })),
    };
  } catch {
    return getInitialSession();
  }
}

function saveSession() {
  if (threadId.value === null) {
    return;
  }

  const session: ChatSession = {
    threadId: threadId.value,
    messages: messages.value,
  };

  localStorage.setItem(storageKey.value, JSON.stringify(session));
}

function loadSession() {
  ensureUserLoaded();
  const session = readSession();
  threadId.value = session.threadId;
  messages.value = session.messages;
}

function startNewChat() {
  localStorage.removeItem(storageKey.value);
  const session = getInitialSession();
  threadId.value = session.threadId;
  messages.value = [];
  input.value = '';
  saveSession();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(text: string) {
  let rendered = escapeHtml(text);

  rendered = rendered.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  rendered = rendered.replace(/(?<!href=")(https?:\/\/[^\s<]+)/g, (_match, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  rendered = rendered.replace(/`([^`]+)`/g, (_match, code) => {
    return `<code>${code}</code>`;
  });

  rendered = rendered.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\*(.+?)\*/g, '<em>$1</em>');

  return rendered;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length && lines[index].startsWith('```')) {
        index += 1;
      }

      blocks.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${formatInline(headingMatch[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^(?:- |\* |\d+\. )/.test(line)) {
      const isOrdered = /^\d+\. /.test(line);
      const items: string[] = [];

      while (index < lines.length && /^(?:- |\* |\d+\. )/.test(lines[index])) {
        items.push(lines[index].replace(/^(?:- |\* |\d+\. )/, ''));
        index += 1;
      }

      const tag = isOrdered ? 'ol' : 'ul';
      blocks.push(
        `<${tag}>${items.map((item) => `<li>${formatInline(item)}</li>`).join('')}</${tag}>`,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith('```') &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^(?:- |\* |\d+\. )/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push(`<p>${paragraphLines.map((paragraphLine) => formatInline(paragraphLine)).join('<br>')}</p>`);
  }

  return blocks.join('');
}

function extractYoutubeVideoId(text: string) {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function getYoutubeEmbedUrl(text: string) {
  const videoId = extractYoutubeVideoId(text);

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function extractJsonObjects(buffer: string) {
  const objects: string[] = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = -1;

  for (let index = 0; index < buffer.length; index += 1) {
    const char = buffer[index];

    if (start === -1) {
      if (char === '{') {
        start = index;
        depth = 1;
        inString = false;
        escaped = false;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;

      if (depth === 0 && start !== -1) {
        objects.push(buffer.slice(start, index + 1));
        start = -1;
      }
    }
  }

  const rest = start === -1 ? '' : buffer.slice(start);
  return { objects, rest };
}

function parseStreamPayloads(buffer: string) {
  const { objects, rest } = extractJsonObjects(buffer);
  const payloads: StreamPayload[] = [];

  for (const object of objects) {
    try {
      const parsed = JSON.parse(object) as StreamPayload;

      if (parsed && typeof parsed.type === 'string') {
        payloads.push(parsed);
      }
    } catch {
      continue;
    }
  }

  return { payloads, rest };
}

const hasMessages = computed(() => messages.value.length > 0);
const assistantMessageCount = computed(
  () => messages.value.filter((message) => message.role === 'assistant').length,
);

async function scrollToBottom() {
  await nextTick();
  const el = chatContainer.value;
  if (!el) return;

  el.scrollTop = el.scrollHeight;
}

function updateAssistantDraftAt(index: number, text: string) {
  const message = messages.value[index];

  if (!message || message.role !== 'assistant') {
    return;
  }

  message.text = text;
  message.status = 'streaming';
  saveSession();
}

function appendAssistantDraftAt(index: number, chunk: string) {
  const message = messages.value[index];

  if (!message || message.role !== 'assistant') {
    return;
  }

  message.text += chunk;
  message.status = 'streaming';
  saveSession();
}

function markAssistantError(index: number, text: string) {
  const message = messages.value[index];

  if (!message || message.role !== 'assistant') {
    return;
  }

  message.text = text;
  message.status = 'error';
  saveSession();
}

function markAssistantDone(index: number) {
  const message = messages.value[index];

  if (!message || message.role !== 'assistant') {
    return;
  }

  message.status = 'done';
  saveSession();
}

async function streamAssistantResponse(userMessage: string, assistantIndex: number) {
  let streamErrored = false;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(createAbortError()), CHAT_TIMEOUT_MS);

  try {
    const response = await fetch(`${KITCHEN_API_URL}/chat/${threadId.value}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userStore.getToken(),
      },
      body: JSON.stringify({
        message: userMessage,
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('No se pudo iniciar el stream del chat.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parsed = parseStreamPayloads(buffer);
      buffer = parsed.rest;

      for (const payload of parsed.payloads) {
        if (payload.type === 'error') {
          streamErrored = true;
          markAssistantError(assistantIndex, payload.message || 'Error en el chat.');
          throw new Error('STREAM_ERROR');
        }

        if (payload.type === 'message') {
          appendAssistantDraftAt(assistantIndex, payload.content || '');
        }
      }

      await scrollToBottom();
    }

    if (buffer.trim()) {
      const parsed = parseStreamPayloads(buffer);

      for (const payload of parsed.payloads) {
        if (payload.type === 'error') {
          streamErrored = true;
          markAssistantError(assistantIndex, payload.message || 'Error en el chat.');
          throw new Error('STREAM_ERROR');
        }

        if (payload.type === 'message') {
          appendAssistantDraftAt(assistantIndex, payload.content || '');
        }
      }
    }

    if (!streamErrored) {
      markAssistantDone(assistantIndex);
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      streamErrored = true;
      markAssistantError(assistantIndex, 'El servidor tardó demasiado en responder.');
    } else if (!streamErrored && (error as Error).message !== 'STREAM_ERROR') {
      markAssistantError(assistantIndex, 'No se pudo obtener la respuesta del modelo.');
    }

    console.error(error);
  } finally {
    window.clearTimeout(timeoutId);
    streaming.value = false;
    saveSession();
    await scrollToBottom();
  }
}

async function sendMessage() {
  const userMessage = input.value.trim();

  if (!userMessage || streaming.value || threadId.value === null) {
    return;
  }

  const userEntry: ChatMessage = {
    id: createMessageId(),
    role: 'user',
    text: userMessage,
  };

  const assistantEntry: ChatMessage = {
    id: createMessageId(),
    role: 'assistant',
    text: '',
    status: 'streaming',
    prompt: userMessage,
  };

  const assistantIndex = messages.value.push(userEntry, assistantEntry) - 1;
  input.value = '';
  saveSession();
  await scrollToBottom();

  streaming.value = true;

  try {
    await streamAssistantResponse(userMessage, assistantIndex);
  } catch (error) {
    console.error(error);
  }
}

async function retryMessage(messageIndex: number) {
  const message = messages.value[messageIndex];

  if (!message || message.role !== 'assistant' || !message.prompt || streaming.value) {
    return;
  }

  message.text = '';
  message.status = 'streaming';
  saveSession();

  streaming.value = true;

  try {
    await streamAssistantResponse(message.prompt, messageIndex);
  } finally {
    await scrollToBottom();
  }
}

watch(
  currentUserKey,
  () => {
    loadSession();
    input.value = '';
  },
  { immediate: true },
);

onMounted(async () => {
  loadSession();
  await scrollToBottom();
});
</script>

<template>
  <v-card class="chat-shell" rounded="xl" elevation="4">
    <v-card-title class="chat-header">
      <div>
        <div class="text-h6">Chat</div>
        <div class="text-caption text-medium-emphasis">
          Hilo activo: {{ threadId }} · {{ assistantMessageCount }} respuestas
        </div>
      </div>

      <v-btn color="primary" variant="tonal" @click="startNewChat"> Nuevo chat </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="chat-body">
      <div ref="chatContainer">
        <div v-if="!hasMessages" class="chat-empty text-medium-emphasis">
          Escribe tu primera pregunta para iniciar el chat.
        </div>

        <div
          v-for="(message, index) in messages"
          :key="message.id"
          class="message-row"
          :class="message.role"
        >
          <div class="message-bubble" :class="message.role">
            <div v-if="message.role === 'user'" class="message-label">Tú</div>
            <div v-else class="message-label">Modelo</div>

            <div v-if="message.role === 'assistant'" class="assistant-content">
              <div
                class="markdown-content"
                v-html="renderMarkdown(message.text || (message.status === 'streaming' ? '...' : ''))"
              ></div>

              <div v-if="getYoutubeEmbedUrl(message.text)" class="video-embed">
                <iframe
                  :src="getYoutubeEmbedUrl(message.text)!"
                  title="Video de YouTube"
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div v-else class="user-message">{{ message.text }}</div>

            <div
              v-if="message.role === 'assistant' && message.status === 'error'"
              class="message-error"
            >
              <v-btn variant="text" color="primary" size="small" @click="retryMessage(index)">
                Reintentar
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="streaming" class="streaming-indicator text-medium-emphasis">
          El modelo está escribiendo...
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <form class="chat-composer" @submit.prevent="sendMessage">
      <v-textarea
        v-model="input"
        class="chat-input"
        auto-grow
        rows="3"
        max-rows="7"
        hide-details
        variant="outlined"
        label="Escribe tu pregunta"
        placeholder="Ej: dame una receta con pollo y arroz"
        :disabled="streaming"
      />

      <v-btn
        color="primary"
        size="large"
        type="submit"
        :loading="streaming"
        :disabled="streaming || !input.trim()"
      >
        Enviar
      </v-btn>
    </form>
  </v-card>
</template>

<style scoped>
.chat-shell {
  min-height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  max-height: calc(100vh - 250px);
  background: rgb(var(--v-theme-surface));
}

.chat-empty,
.streaming-indicator {
  text-align: center;
  padding: 1rem 0;
}

.message-row {
  display: flex;
  margin-bottom: 0.9rem;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: min(760px, 92%);
  border-radius: 18px;
  padding: 0.9rem 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.message-bubble.user {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.message-bubble.assistant {
  background: rgba(var(--v-theme-surface-variant), 0.35);
  color: rgb(var(--v-theme-on-surface));
}

.message-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
  opacity: 0.8;
  text-transform: uppercase;
}

.user-message {
  white-space: pre-wrap;
  line-height: 1.55;
}

.markdown-content {
  line-height: 1.65;
}

.markdown-content :deep(p) {
  margin: 0 0 0.75rem;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 0 0 0.6rem;
  line-height: 1.2;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0 0 0.75rem 1.2rem;
  padding-left: 1rem;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: 6px;
  background: rgba(127, 127, 127, 0.15);
  font-family:
    ui-monospace,
    SFMono-Regular,
    SF Mono,
    Consolas,
    Liberation Mono,
    monospace;
  font-size: 0.92em;
}

.markdown-content :deep(pre) {
  overflow-x: auto;
  padding: 0.85rem;
  border-radius: 12px;
  background: rgba(127, 127, 127, 0.12);
  margin: 0 0 0.75rem;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: transparent;
  white-space: pre-wrap;
}

.markdown-content :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.assistant-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.video-embed {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.08);
}

.video-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.chat-composer {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  padding: 1rem;
}

.chat-input {
  flex: 1;
}

@media (max-width: 768px) {
  .chat-shell {
    min-height: calc(100vh - 72px);
  }

  .chat-header,
  .chat-composer {
    flex-direction: column;
    align-items: stretch;
  }

  .chat-body {
    max-height: calc(100vh - 290px);
  }

  .message-bubble {
    max-width: 100%;
  }
}
</style>
