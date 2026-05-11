<template>
  <div class="page-header">
    <nav>
      <span v-for="cate in category" :key="cate" @click="fetchCourses(cate._id)">{{ cate.name }}</span>
    </nav>
  </div>
  <div class="container">
    <h1>Danh sách khóa học</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- List -->
    <div v-else class="grid">
      <div class="card" v-for="course in courses" :key="course._id" @click="goToDetail(course._id)">
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
const category = ref([])
const goToDetail = (id) => {
  router.push({ name: 'CourseDetailPage', params: { id } })
}
const fetchCourses = async (categoryId) => {
  loading.value = true
  error.value = null

  try {
    console.log(categoryId)
    const res = await axiosInstance.get('/courses',
      {params:{category:categoryId}}
    )
    courses.value = res.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi server'
  } finally {
    loading.value = false
  }
}
const getCategory = async () => {
  const res = await axiosInstance.get('/courseCategories/')
  category.value = res.data.data

  console.log(res)
}
onMounted(async () => {
  console.log('CoursesPage mounted, bắt đầu gọi API')
  await fetchCourses()
  await getCategory()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 32px 20px;
}

/* HEADER */
.page-header {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;

  position: sticky;
  top: 0;
  z-index: 100;
}

.page-header nav {
  max-width: 1200px;
  margin: auto;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px 20px;

  overflow-x: auto;
}

/* CATEGORY TAG */
.page-header nav span {
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 999px;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;
  transition: all 0.3s ease;

  white-space: nowrap;
}

.page-header nav span:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-2px);
}

/* TITLE */
h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 28px;
  color: #111827;
}

/* LOADING + ERROR */
.loading,
.error {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
}

.error {
  color: #dc2626;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* CARD */
.card {
  background: white;
  border-radius: 18px;
  overflow: hidden;

  cursor: pointer;

  transition: all 0.3s ease;

  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

.card:hover {
  transform: translateY(-6px);

  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

/* IMAGE */
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

/* CONTENT */
.card h3 {
  font-size: 20px;
  font-weight: 700;

  padding: 16px 16px 8px;
  color: #111827;
}

.card p {
  padding: 0 16px 20px;

  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* SCROLL BAR */
.page-header nav::-webkit-scrollbar {
  height: 6px;
}

.page-header nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

/* MOBILE */
@media (max-width: 768px) {
  h1 {
    font-size: 26px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card img {
    height: 200px;
  }
}
</style>
