<template>
  <div class="container">
    <h1>Flash Cards</h1>

    <!-- Create -->
    <div class="create-box">
      <input v-model="form.name" placeholder="Deck name" />
      <input v-model="form.description" placeholder="Description" />
      <button @click="createDeck">Create</button>
    </div>

    <div class="list">
      <div v-for="deck in decks" :key="deck._id" class="card" @click="GoToFlashCardManage(deck._id)">
        <h3>{{ deck.name }}</h3>
        <p>{{ deck.description }}</p>
        <small>Cards: {{ deck.card_count }}</small>

        <div class="actions">
          <button @click="startEdit(deck)">Edit</button>
          <button @click="deleteDeck(deck._id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="editing" >
      <div>
        <h3>Edit Deck</h3>
        <input v-model="editForm.name" />
        <input v-model="editForm.description" />
        <div class="actions">
          <button @click="updateDeck">Save</button>
          <button @click="editing = null">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '../../../services/axiosService.js'
import { useRouter } from 'vue-router'
const router = useRouter()

const decks = ref([])
const editing = ref(null)

const form = ref({
  name: '',
  description: '',
  is_public: true,
})

const editForm = ref({
  name: '',
  description: '',
  is_public: true,
})

const API = '/cardLists'
const fetchDecks = async () => {
  const res = await axiosInstance.get(`${API}/me`)
  decks.value = res.data
}
const createDeck = async () => {
  if (!form.value.name) return

  await axiosInstance.post(API, form.value)

  form.value = {
    name: '',
    description: '',
    is_public: true,
  }

  fetchDecks()
}
const GoToFlashCardManage = (id) => {
  router.push({ name: 'FlashCardManage', params: { id } })
}
const deleteDeck = async (id) => {
  if (!confirm('Delete this deck?')) return
  await axiosInstance.delete(`${API}/${id}`)
  fetchDecks()
}
const startEdit = (deck) => {
  editing.value = deck
  editForm.value = { ...deck }
}
const updateDeck = async () => {
  await axiosInstance.put(`${API}/${editing.value._id}`, editForm.value)
  editing.value = null
  fetchDecks()
}

onMounted(fetchDecks)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.create-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.list {
  display: grid;
  gap: 15px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

button {
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
}

.modal-content {
  background: white;
  padding: 20px;
  margin: 100px auto;
  width: 300px;
  border-radius: 10px;
}
</style>
