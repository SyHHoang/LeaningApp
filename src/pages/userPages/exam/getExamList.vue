<template>
  <div class="exam-manager-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <p><input type="text" placeholder="Tìm kiếm đề thi..." v-model="searchTerm" /> <i class="bi bi-search" @click="doSearch"></i>
      </p>
      <p> Mức độ:
        <select v-model="filterLevel" @change="doSearch" class="form-select form-select-sm w-auto">
        <option value="">Tất cả mức độ</option>
        <option value="Dễ">Dễ</option>
        <option value="Trung bình">Trung bình</option>
        <option value="Khó">Khó</option>
      </select>
      </p>

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
        <router-link to="/admin/exams/add" class="btn btn-primary mt-3">Thêm Exam</router-link>
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
                title="Sửa đề thi"
              >
                Xem chi tiết
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xem chi tiết đề thi -->
    <div
      v-if="examToView"
      class="modal d-block bg-dark bg-opacity-50"
      tabindex="-1"
      @click.self="examToView = null"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ examToView.title }} ({{ examToView.level }})</h5>
            <button type="button" class="btn-close" @click="examToView = null"></button>
          </div>
          <div class="modal-body">
            <div v-if="viewLoading" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <template v-else-if="examDetail">
              <div class="mb-3">
                <p class="mb-1"><strong>Tiêu đề:</strong> {{ examDetail.title }}</p>
                <p class="mb-1"><strong>Mức độ:</strong> {{ examDetail.level }}</p>
                <p class="mb-1"><strong>Số câu:</strong> {{ totalQuestions(examDetail) }}</p>
                <p class="mb-1"><strong>Thời gian:</strong> {{ totalDuration(examDetail) }} phút</p>
                <p class="mb-0"><strong>Cấu trúc:</strong> Từ vựng {{ examDetail.structure?.vocabulary?.count || 0 }} câu / {{ examDetail.structure?.vocabulary?.duration || 0 }} phút — Đọc {{ examDetail.structure?.reading?.count || 0 }} câu / {{ examDetail.structure?.reading?.duration || 0 }} phút — Nghe {{ examDetail.structure?.listening?.count || 0 }} câu / {{ examDetail.structure?.listening?.duration || 0 }} phút</p>
              </div>
              <hr />
              <h6 class="mb-2">Danh sách câu hỏi</h6>
              <div class="view-questions-list">
                <div
                  v-for="(q, idx) in (examDetail.questionIds || [])"
                  :key="q._id || idx"
                  class="border rounded p-3 mb-2"
                >
                  <p class="mb-1"><strong>Câu {{ idx + 1 }}:</strong> {{ q.questionText || '—' }}</p>
                  <img
                    v-if="q.image?.imageUrl"
                    :src="q.image.imageUrl"
                    alt="Hình"
                    class="img-thumbnail mb-1"
                    style="max-height: 100px"
                  />
                  <audio v-if="q.audio.audioUrl" :src="q.audio.audioUrl" controls></audio>
                  <p class="small mb-0">
                    Đáp án đúng: {{ (q.options && q.options[q.correctAnswer]) || '—' }}
                  </p>
                </div>
              </div>
            </template>
          </div>
          <div class="modal-footer">
            <router-link
              v-if="examToView"
              :to="{ name: 'EditExam', params: { id: examToView._id } }"
              class="btn btn-warning"
              @click="examToView = null"
            >
              Sửa đề thi
            </router-link>
            <button type="button" class="btn btn-secondary" @click="examToView = null">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div
      v-if="examToDelete"
      class="modal d-block bg-dark bg-opacity-50"
      tabindex="-1"
      @click.self="examToDelete = null"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa đề thi</h5>
            <button type="button" class="btn-close" @click="examToDelete = null"></button>
          </div>
          <div class="modal-body">
            Bạn có chắc muốn xóa đề thi <strong>{{ examToDelete.title }}</strong> ({{ examToDelete.level }})?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="examToDelete = null">Hủy</button>
            <button type="button" class="btn btn-danger" @click="doDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/services/axiosService';
//const router = useRouter();
const examList = ref([]);
const loading = ref(true);
const error = ref('');
const examToDelete = ref(null);
const examToView = ref(null);
const examDetail = ref(null);
const viewLoading = ref(false);
const searchTerm = ref('');
const filterLevel = ref('');
async function doSearch() {
  const term = searchTerm.value.trim().toLowerCase();
  const level = filterLevel.value;
  const res= await axiosInstance.get('/exams', {
    params: {
      search: term,
      level: level
    }
  });
  if (res.data?.success && Array.isArray(res.data.data)) {
    examList.value = res.data.data;
  } else {    examList.value = [];
  }
}
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

async function fetchExams() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axiosInstance.get('/exams');
    if (res.data?.success && Array.isArray(res.data.data)) {
      examList.value = res.data.data;
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
  fetchExams();
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
</style>
