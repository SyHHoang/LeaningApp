<template>
  <div class="container">
    <header>
      <h1>Public Flash Cards</h1>
    </header>
    <section class="create-box">
      <h2>Tạo danh sách Flashcard</h2>
      <form @submit.prevent="createDeck">
        <input v-model="form.name" placeholder="Deck name" />
        <input v-model="form.description" placeholder="Description" />
        <button type="submit">Create</button>
      </form>
    </section>
    <section class="list">
      <h2>Danh sách Deck</h2>
      <div class="cards">
        <article
          v-for="deck in decks"
          :key="deck._id"
          class="card"
          @click="GoToFlashCardManage(deck._id)"
        >
          <h3>{{ deck.name }}</h3>
          <p>{{ deck.description }}</p>
          <small>Cards: {{ deck.card_count }}</small>

          <div class="actions">
            <button @click.stop="startEdit(deck)">Edit</button>
            <button @click.stop="deleteDeck(deck._id)">Delete</button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="editing" class="edit-box">
      <h2>Edit Deck</h2>
      <form @submit.prevent="updateDeck">
        <input v-model="editForm.name" />
        <input v-model="editForm.description" />

        <div class="actions">
          <button type="submit">Save</button>
          <button type="button" @click="editing = null">Cancel</button>
        </div>
      </form>
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

</style>
