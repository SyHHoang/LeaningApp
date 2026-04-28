<template>
  <div class="container">
    <h1>📚 Danh sách khóa học</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Đang tải dữ liệu...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- List -->
    <div v-else class="grid">
<div
  class="card"
  v-for="course in courses"
  :key="course._id"
  @click="goToDetail(course._id)"
>
        <img :src="course.imgUrl" />
        <h3>{{ course.name }}</h3>
        <p>{{ course.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/services/axiosService'
import { useRouter } from 'vue-router'
const router = useRouter()
const courses = ref([])
const loading = ref(false)
const error = ref(null)

const goToDetail = (id) => {
  router.push({ name: 'CourseDetailPage', params: { id } })
}
const fetchCourses = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await axiosInstance.get('/courses', {
    })
    courses.value = res.data.data

  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi server'
  } finally {
    loading.value = false
  }
}

onMounted(async() => {
  console.log('CoursesPage mounted, bắt đầu gọi API')
  await fetchCourses()
})
</script>

<style scoped>
.container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  transition: 0.3s;
  background: #fff;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
