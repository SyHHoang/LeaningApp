<template>
  <div class="exam-manager-page">
    <div class="search-bar">
      <p><input type="text" placeholder="Tìm kiếm đề thi..." v-model="searchTerm" />
      </p>
      <p> Mức độ:</p>
        <select v-model="filterLevel" class="form-select form-select-sm w-auto">
        <option value="">Tất cả mức độ</option>
        <option value="Dễ">Dễ</option>
        <option value="Trung bình">Trung bình</option>
        <option value="Khó">Khó</option>
       </select>

      <i class="bi bi-search" @click="fetchExams(1)"></i>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="examList.length === 0" class="card shadow-sm">
      <div class="card-body text-center py-5 text-muted">
        <i class="bi bi-journal-text display-4"></i>
        <p class="mt-3 mb-0">Chưa có đề thi nào.</p>
      </div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Tiêu đề</th>
            <th>Mức độ</th>
            <th>Số câu</th>
            <th>Thời gian (phút)</th>
            <th>Ngày tạo</th>
            <th class="text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in examList" :key="exam._id">
            <td>{{ exam.title }}</td>
            <td>
              <span class="badge bg-secondary">{{ exam.level }}</span>
            </td>
            <td>{{ totalQuestions(exam) }}</td>
            <td>{{ totalDuration(exam) }}</td>
            <td>{{ formatDate(exam.createdAt) }}</td>
            <td class="text-end">
              <router-link
                :to="{ name: 'PracticePage', params: { id: exam._id } }"
                class="btn btn-sm btn-outline-warning me-1"
                title="đề thi"
              >
                Làm bài
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class='nav-exam-page'>
    <nav>
      <i class="bi bi-chevron-left"></i>
      <span v-for="page in totalPage" :key="page" @click="fetchExams(page)"
      class="exam-page"
      >{{ page }}</span>
    <i class="bi bi-chevron-right"></i>
    </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import axiosInstance from '@/services/axiosService';
//const router = useRouter();
const examList = ref([]);
const loading = ref(true);
const totalPage=ref(0)
const error = ref('');
const searchTerm = ref('');
const filterLevel = ref('');
const route=useRoute()
const router=useRouter()
function totalQuestions(exam) {
  const s = exam.structure || {};
  return (s.vocabulary?.count || 0) + (s.reading?.count || 0) + (s.listening?.count || 0);
}

function totalDuration(exam) {
  const s = exam.structure || {};
  return (s.vocabulary?.duration || 0) + (s.reading?.duration || 0) + (s.listening?.duration || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}
function changeURL(page){
  const URL={page:page}
  const term = searchTerm.value.trim().toLowerCase();
  if(filterLevel.value) URL.level=filterLevel.value
  if(term ) URL.term=term
  router.push({
        query:URL
      })
}
async function fetchExams(page) {
  loading.value = true;
  const term = searchTerm.value.trim().toLowerCase();
  error.value = '';
  try {
    console.log('Đang gọi API /exams để lấy danh sách đề thi');
    const res = await axiosInstance.get('/exams',
      {
        params:{
          page:page||1,
          level:filterLevel.value||'None',
          search: term,
        }
      }
    );
    if (res.data?.success && Array.isArray(res.data.data)) {
      changeURL(page)
      examList.value = res.data.data;
      totalPage.value=res.data.totalPage
      console.log(examList.value)
    } else {
      examList.value = [];
    }
  } catch (err) {
    console.error('fetchExams error:', err);
    error.value = err.response?.data?.message || 'Không thể tải danh sách đề thi.';
    examList.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const oldPage=route.query.page||1
  searchTerm.value=route.query.term||''
  filterLevel.value=route.query.level
  fetchExams(oldPage);
});
</script>

<style scoped>
.exam-manager-page {
  max-width: 1000px;
  margin: 0 auto;
}
.view-questions-list {
  max-height: 400px;
  overflow-y: auto;
}
.search-bar{
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    width: fit-content;
}
.search-bar p{
    margin: 0;
    font-weight: 500;
    color: #333;
}

.search-bar input{
    width: 260px;
    padding: 10px 14px;

    border: 1px solid #dcdcdc;
    border-radius: 10px;

    outline: none;
    font-size: 15px;

    transition: all 0.3s ease;
}

.search-bar input:focus{
    border-color: #396fcd;
    box-shadow: 0 0 0 3px rgba(57,111,205,0.2);
}

.search-bar select{
    padding: 8px 12px;

    border-radius: 10px;
    border: 1px solid #dcdcdc;

    cursor: pointer;
    transition: 0.3s;
}

.search-bar select:focus{
    border-color: #396fcd;
    box-shadow: 0 0 0 3px rgba(57,111,205,0.2);
}

.search-bar i{
    font-size: 20px;
    color: white;
    background: #396fcd;
    padding: 5px 5px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
}

.search-bar i:hover{
    background: #2857ad;
    transform: scale(1.05);
}
.nav-exam-page{
  display:flex;
  justify-self: center;
}
.exam-page{
  border: 1px solid black;
  border-radius: 3px;
  padding:2px;
  margin:4px
}
.exam-page:hover{
  background-color:blue;
  color:white
}
</style>
