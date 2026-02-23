<template>
  <div>
    <h1>Luyện tập</h1>
    <p>Trang này dành cho việc luyện tập các kỹ năng và kiến thức đã học.</p>
  </div>
  <div>
    <label>Làm đề thi</label>
    <label><router-link to="/practiceSkill">Luyện tập 4 kỹ năng</router-link></label>
    <label>Tạo danh sách flashcards</label>
        <button @click="openForm">Tạo mới danh sách</button>
        <!-- Modal thêm list flashcards -->
        <div v-if="isFormOpen">
           <i  @click="closeForm" class="bi-bi-close"></i>
            <label for="listName">Tên danh sách:</label>
            <input type="text" v-model="title"/>
            <label>Mô tả</label>
            <input type="text" v-model="description"/>
            <button @click="createListFlashcard">Tạo</button>
        </div>
  </div>
  <div>
    <label>Danh sách flashcards</label>
    <div v-for="list in flashcardLists" :key="list.id" >
      <div @click="goToFlashcard(list._id)">
        <p >{{ list.title }}</p>
        <p>{{ list.description}}</p>
        <p>{{ list.flashcards.length}}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
  import axiosInstance from '@/services/axiosService';
  import { ref, onMounted } from 'vue';
  import router from '@/router/index.js'
  const flashcardLists = ref([]);
  const title = ref('');
  const description = ref('');
  const isFormOpen = ref(false);
  const openForm = () => {
    isFormOpen.value = true;
  };
  const closeForm = () => {
    isFormOpen.value = false;
  };
  const goToFlashcard = (listId) => {
    router.push({ name: 'flashcardDetail', params: { id: listId } });
  };
  const createListFlashcard = async() => {
    try{
      const response= await axiosInstance.post('/flashcard/createList', {
        title: title.value,
        description: description.value
      });
      if(response.status === 201){
        alert('Tạo danh sách flashcard thành công');
        title.value = '';
        description.value = '';
        isFormOpen.value = false;
        await getFlashcardLists();
      }else{
        alert('Tạo danh sách flashcard thất bại');
      }
    }catch(err){
      console.error('Error creating flashcard list:', err);
    }
  };
  const getFlashcardLists = async() => {
    try{
      const response = await axiosInstance.get('/flashcard/getlists');
      if(response.status === 200){
        console.log('Danh sách flashcards:', response.data);
        flashcardLists.value = response.data;
      }else{
        console.error('Lấy danh sách flashcards thất bại');
      }
    }catch(err){
      console.error('Error fetching flashcard lists:', err);
    }
  };
onMounted(async() => {
  await getFlashcardLists();
});
</script>
