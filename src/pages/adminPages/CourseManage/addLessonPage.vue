<template>

  <div class="main-content">
      <div>
        <label>Khởi động</label>
        <button>Thêm khối</button>
        <div>
          <div v-for="list in warmUpCount" :key="list.createAt">

          </div>
        </div>
      </div>
      <div>
        <label>Từ vựng</label>
        <button>Thêm khối</button>
        <div>
          <div v-for="(list,index) in vocabularyCount" :key="list.createAt">
            <div>
              <label>Thêm nhanh</label>
              <input v-model='search' placeholder="Tìm kiếm từ vựng"/>
              <button>Tìm kiếm</button>
            </div>
            <div>
              <label>Từ vựng</label>
              <input v-model="list.pattern"/>
              <label>Giải thích</label>
              <textarea v-model="list.explaination"></textarea>
              <label>Cách viết kiểu Latin</label>
              <input v-model="list.latin"/>
              <label>Trình độ</label>
              <select v-model="list.level">
                <option></option>
              </select>
              <label>Ví dụ</label>
              <textarea v-model="list.example"></textarea>
            </div>
            <button @click="deleteVocabulary(index)"></button>
          </div>
        </div>
      </div>
      <div>
        <label>Ngữ pháp</label>
      </div>
      <div>
        <label>Kanji</label>
      </div>
      <div>
        <label>Video bài giảng</label>
      </div>
  </div>
  <div>
    <label>Bài tập</label>
  </div>
</template>
<script setup>
import {ref,onMounted} from 'vue'
const warmUpCount=ref([])
const vocabularyCount=ref([])
const grammarCount=ref([])
const kanjiCount=ref([])
const practiceCount=ref([])
onMounted(() => {
  warmUpCount.value = []
  vocabularyCount.value = []
  grammarCount.value = []
  kanjiCount.value = []
  practiceCount.value = []
})
</script>
