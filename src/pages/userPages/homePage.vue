<template>
  <section>
    <h2>Bài học hôm nay</h2>
  </section>

  <!-- COURSE -->
  <section>
    <h2>Khóa học online nổi bật</h2>

    <!-- loading -->
    <div v-if="!courseData.length">Loading courses...</div>

    <Swiper
      v-else
      :key="courseData.length"
      :modules="[Autoplay, Navigation, Pagination]"
      :slides-per-view="1"
      :loop="courseData.length > 1"
      :speed="800"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      navigation
      pagination
      class="mySwiper"
    >
      <SwiperSlide
        v-for="(course, index) in courseData"
        :key="index"
      >
        <img :src="course.imgUrl" />
        <div class="content">
          <p>{{ course.name }}</p>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>

  <!-- EXAM -->
  <section>
    <h2>Đề thi mới nhất</h2>

    <!-- loading -->
    <div v-if="!examData.length">Loading exams...</div>

    <Swiper
      v-else
      :key="examData.length"
      :modules="[Autoplay, Navigation, Pagination]"
      :slides-per-view="1"
      :loop="examData.length > 1"
      :speed="800"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      navigation
      pagination
      class="mySwiper"
    >
      <SwiperSlide
        v-for="(exam, index) in examData"
        :key="index"
      >
        <div class="content">
          <p>{{ exam.title }}</p>
          <p>Thời gian: {{ exam.totalTime }} phút</p>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import axiosInstance from '@/services/axiosService'

// styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const courseData = ref([])
const examData = ref([])

onMounted(async () => {
  try {
    const [courseRes, examRes] = await Promise.all([
      axiosInstance.get('/userDashBoard/course'),
      axiosInstance.get('/userDashBoard/exam')
    ])

    if (courseRes.data.success) {
      courseData.value = courseRes.data.data
    }

    if (examRes.data.success) {
      examData.value = examRes.data.data
    }
  } catch (err) {
    console.error('API error:', err)
  }
})
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 300px;
  margin-bottom: 30px;
}

.mySwiper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 10px;
  text-align: center;
}

h2 {
  margin-bottom: 10px;
}
</style>
