<template>
  <div class="container">
    <div v-if="loading">Đang tải bài học...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="lesson">
      <h1>{{ lesson.title }}</h1>
      <p class="description">{{ lesson.description }}</p>
      <h2>Nội dung bài học</h2>

      <div v-if="blocks.length === 0">
        Không có nội dung
      </div>

      <div v-else>
        <div
          v-for="block in sortedBlocks"
          :key="block._id"
          class="block"
        >
          <h3>{{ block.blockTitle }}</h3>

          <div
            v-for="(item, index) in block.blockContent"
            :key="index"
            class="block-item"
          >
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>

            <!-- Video -->
            <video
              v-if="item.videoUrl"
              controls
              class="video"
            >
              <source :src="item.videoUrl" type="video/mp4" />
            </video>

            <!-- Image -->
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              class="image"
            />
          </div>
        </div>
      </div>

      <!-- PRACTICE -->
      <h2>📝 Bài tập</h2>

      <div v-if="lesson.practice.content.length === 0">
        Không có câu hỏi
      </div>

      <div
        v-for="(q, index) in lesson.practice.content"
        :key="q._id"
        class="question"
      >
        <h4>Câu {{ index + 1 }}: {{ q.questionText }}</h4>

        <!-- Image -->
        <img v-if="q.image?.imageUrl" :src="q.image.imageUrl" />

        <!-- Options -->
        <ul>
          <li
            v-for="(opt, i) in q.options"
            :key="i"
          >
            {{ i + 1 }}. {{ opt }}
          </li>
        </ul>

        <p class="answer">
          Đáp án đúng: {{ q.correctAnswer + 1 }}
        </p>

        <p class="explain">
          Giải thích: {{ q.explanation }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axiosInstance from '@/services/axiosService'
import { useRoute } from 'vue-router'

const route = useRoute()
const lessonId = route.params.id

const lesson = ref(null)
const blocks = ref([])
const loading = ref(false)
const error = ref(null)

// 👉 sort block theo order
const sortedBlocks = computed(() => {
  return [...blocks.value].sort((a, b) => a.order - b.order)
})

const fetchLesson = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await axiosInstance.get(
      `/lessons/${lessonId}`,
    )
    lesson.value = res.data.lessonData
    blocks.value = res.data.blockData

  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi server'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLesson)
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}

.description {
  margin-bottom: 20px;
}

.error {
  color: red;
}

.block {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.block-item {
  margin-bottom: 10px;
}

.video {
  width: 100%;
  margin-top: 10px;
}

.image {
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
}

.question {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.answer {
  color: green;
}

.explain {
  color: #555;
}
</style>
