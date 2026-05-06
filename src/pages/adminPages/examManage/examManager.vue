<template>
  <div class="exam-container">
    <div class="exam-header" >
      <h2>Quản lý đề thi</h2>
      <router-link to="/admin/exams/add" >
        <i class="bi bi-plus"></i>
        Thêm Exam
      </router-link>
    </div>
    <hr>
  <div class='exam-main-content'>
    <div v-if="loading" >
        <span>Đang tải...</span>
    </div>

    <div v-else-if="error" >
      {{ error }}
    </div>
    <div v-else-if="examList.length === 0" >
      <div >
        <i ></i>
        <p >Chưa có đề thi nào.</p>
        <router-link to="/admin/exams/add" >Thêm Exam</router-link>
      </div>
    </div>

    <div v-else>
      <h4 class="exam-list-title">Danh sách đề thi</h4>
      <table class="exam-list-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mức độ</th>
            <th>Số câu</th>
            <th>Thời gian (phút)</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in examList" :key="exam._id">
            <td>{{ exam.title }}</td>
            <td>
              <span>{{ exam.level }}</span>
            </td>
            <td>{{ totalQuestions(exam) }}</td>
            <td>{{ totalDuration(exam) }}</td>
            <td>{{ formatDate(exam.createdAt) }}</td>
            <td class="action-item">
              <router-link
                :to="{ name: 'EditExam', params: { id: exam._id } }"

                title="Sửa đề thi"
              >
                <i class="bi bi-pencil"></i>
              </router-link>
              <button
                type="button"
                title="Xóa đề thi"
                @click="confirmDelete(exam)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
    <!-- Modal xem chi tiết đề thi -->
    <div
      v-if="examToView"

      tabindex="-1"
      @click.self="examToView = null"
    >
      <div>
        <div >
          <div >
            <h5 >{{ examToView.title }} ({{ examToView.level }})</h5>
            <button type="button"  @click="examToView = null"></button>
          </div>
          <div >
            <div v-if="viewLoading" >
              <div ></div>
            </div>
            <template v-else-if="examDetail">
              <div>
                <p ><strong>Tiêu đề:</strong> {{ examDetail.title }}</p>
                <p ><strong>Mức độ:</strong> {{ examDetail.level }}</p>
                <p ><strong>Số câu:</strong> {{ totalQuestions(examDetail) }}</p>
                <p ><strong>Thời gian:</strong> {{ totalDuration(examDetail) }} phút</p>
                <p ><strong>Cấu trúc:</strong> Từ vựng {{ examDetail.structure?.vocabulary?.count || 0 }} câu / {{ examDetail.structure?.vocabulary?.duration || 0 }} phút — Đọc {{ examDetail.structure?.reading?.count || 0 }} câu / {{ examDetail.structure?.reading?.duration || 0 }} phút — Nghe {{ examDetail.structure?.listening?.count || 0 }} câu / {{ examDetail.structure?.listening?.duration || 0 }} phút</p>
              </div>
              <hr />
            </template>
          </div>
          <div >
            <router-link
              v-if="examToView"
              :to="{ name: 'EditExam', params: { id: examToView._id } }"

              @click="examToView = null"
            >
              Sửa đề thi
            </router-link>
            <button type="button"  @click="examToView = null">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div
      v-if="examToDelete"

      tabindex="-1"
      @click.self="examToDelete = null"
    >
      <div>
        <div>
          <div>
            <h5>Xác nhận xóa đề thi</h5>
            <button type="button"  @click="examToDelete = null"></button>
          </div>
          <div>
            Bạn có chắc muốn xóa đề thi <strong>{{ examToDelete.title }}</strong> ({{ examToDelete.level }})?
          </div>
          <div>
            <button type="button"  @click="examToDelete = null">Hủy</button>
            <button type="button"  @click="doDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
//import { useRouter } from 'vue-router';
import axiosInstance from '@/services/axiosService';

//const router = useRouter();
const examList = ref([]);
const loading = ref(true);
const error = ref('');
const examToDelete = ref(null);
const examToView = ref(null);
const examDetail = ref(null);
const viewLoading = ref(false);

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

function confirmDelete(exam) {
  examToDelete.value = exam;
}

async function doDelete() {
  if (!examToDelete.value) return;
  try {
    const res = await axiosInstance.delete(`/exams/${examToDelete.value._id}`);
    if (res.data?.success) {
      examToDelete.value = null;
      await fetchExams();
    } else {
      alert(res.data?.message || 'Xóa thất bại.');
    }
  } catch (err) {
    console.error('delete exam error:', err);
    alert(err.response?.data?.message || 'Có lỗi khi xóa đề thi.');
  }
}

onMounted(() => {
  fetchExams();
});
</script>

<style scoped>
@import '../../../style/admin/exam/examManagerStyle.css'
</style>
