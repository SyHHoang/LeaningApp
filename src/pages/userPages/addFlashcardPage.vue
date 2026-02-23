<script setup>
import { ref } from 'vue';
//import axiosInstance from '@/services/axiosService';
const newFlashcard = ref({
  question: '',
  answer: '',
  explain: ''
});
const statusModalAddFlashcard = ref(false);
const openModalAddFlashcard = () => {
  statusModalAddFlashcard.value = true;
};
const closeModalAddFlashcard = () => {
  statusModalAddFlashcard.value = false;
};
  //cài đặt phần ôn tập
  //tạo flashcard từ những bài học đã học
  //tự tạo flashcard để ôn tập....flash bao gồm câu hỏi và câu trả lời(câu trả lời gồm có gõ văn bản hoặc không gõ văn bản)
</script>
<template>
<input type="text" value="Nguyễn Văn A">
<input type="submit" value="Đăng nhập">


<div class="add-flashcard-button-container">
  <button class="add-flashcard-button" @click="openModalAddFlashcard">
    <i class="bi bi-plus"></i>Thêm Flashcard
  </button>
</div>
<div class="add-many-flashcard-button">
  <button class="add-many-flashcard-button">
    <i class="bi bi-plus"></i>Thêm Nhiều Flashcard
  </button>
</div>

<!-- Modal thêm flashcard -->
<div class="modal-add-flashcard" v-if="statusModalAddFlashcard">
  <div class="content-add-flashcard">
    <div class="header-add-flashcard">
      <h3>Thêm Flashcard</h3>
      <i class="bi bi-x-circle" @click="closeModalAddFlashcard"></i>
    </div>
    <div class="form-add-flashcard">
      <form @submit.prevent="addFlashcard">
        <div class="form-group">
          <label for="question">Câu hỏi:</label>
          <input type="text" id="question" v-model="newFlashcard.question" required />
        </div>
        <div class="form-group">
          <label for="answer">Câu trả lời:</label>
          <input type="text" id="answer" v-model="newFlashcard.answer" required />
        </div>
          <div class="form-group">
          <label for="answer">Giải thích:</label>
          <input type="text" id="answer" v-model="newFlashcard.explain"/>
        </div>
        <div >
          <label for="answer">Phiên âm</label>
          <input type="text" id="answer" v-model="newFlashcard.explain"/>
        </div>
        <button type="submit" class="submit-button">Thêm Flashcard</button>
      </form>
    </div>
  </div>
</div>
<!-- modal thêm nhiều flashcard -->

</template>
