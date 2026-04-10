<template>
  <div class="container">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      Đang tải chi tiết khóa học...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="course" class="course-detail">
      <img :src="course.imgUrl" class="banner" />

      <h1>{{ course.name }}</h1>
      <p class="description">{{ course.description }}</p>

      <h2>Danh sách bài học</h2>

      <div v-if="course.lesson.length === 0">
        Chưa có bài học nào
      </div>

      <ul v-else class="lesson-list">
<li
  v-for="lesson in course.lesson"
  :key="lesson._id"
  @click="goToLesson(lesson._id)"
  style="cursor: pointer;"
>
  <h3>{{ lesson.title }}</h3>
  <p>{{ lesson.description }}</p>
</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/services/axiosService'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const courseId = route.params.id
const course = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchCourseDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await axiosInstance.get(
      `courses/${courseId}`
    )

    course.value = res.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi server'
  } finally {
    loading.value = false
  }
}
const goToLesson = (id) => {
  router.push({ name: 'LessonDetailPage', params: { id } })
}
onMounted(fetchCourseDetail)
</script>

<style scoped>
.container {
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.course-detail {
  max-width: 800px;
  margin: auto;
}

.banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 20px;
  font-size: 16px;
}

.lesson-list {
  list-style: none;
  padding: 0;
}

.lesson-list li {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: 0.3s;
}

.lesson-list li:hover {
  background: #f5f5f5;
}
</style>
