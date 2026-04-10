<template>
  <h2>Lịch sử thi</h2>
  <div>
    <label>Lọc kết quả thi</label>
    <input type="text"  v-model="searchText"  />
    <i class="fas fa-search"></i>
    <div>
      <label>Lọc theo ngày thi:</label>
      <select v-model="examDate">
        <option :value="0">Tất cả</option>
        <option :value="7">7 ngày gần đây</option>
        <option :value="30">30 ngày gần đây</option>
        <option :value="90">90 ngày gần đây</option>
      </select>
    </div>
  </div>
  <div>
    <label>Thống kê</label>
    <div>
      <p><strong>Tổng số đề đã làm:</strong> {{ Statistics.length }}</p>
      <p><strong>Điểm trung bình:</strong> {{ Statistics.averageScore }}</p>
    </div>
  </div>
  <div v-if="examHistoryList.length === 0">
    <p>Không có lịch sử thi nào.</p>
  </div>
  <div v-else>
    <div v-for="(history, index) in examHistoryList" :key="index" class="exam-history-item">
      <router-link :to="{ name: 'ExamResultPage', params: { id: history.examId } }">Xem chi tiết</router-link>
      <p><strong>Kỳ thi:</strong> {{ history.examInfo.title }}</p>
      <p><strong>Ngày thi:</strong> {{ new Date(history.submitTime).toLocaleString() }}</p>
      <p><strong>Điểm số:</strong> {{ history.totalScore }}</p>
      <p><strong>Số câu trả lời đúng:</strong> {{ history.correctCount }}</p>
      <hr />
    </div>
</div>
</template>
<script setup>
import {ref,onMounted} from 'vue'
import axiosInstance from '@/services/axiosService';
import { alertService } from '@/services/alertService';
const searchText = ref('')
const examDate = ref('')
const Statistics=ref({
  length:0,
  averageScore:0,
})
const examHistoryList = ref([])
const loadExamHistory = async()=>{
  try {
    const res = await axiosInstance.get('/userExam/history')
    if(res.data.status === 'success'){
      examHistoryList.value = res.data.data
    }else{
      alertService('error','Không thể tải lịch sử thi')
    }
  } catch {
    alertService('error','error','Đã xảy ra lỗi khi tải lịch sử thi')
  }
}
onMounted(async ()=>{
  await loadExamHistory()
  Statistics.value.length = examHistoryList.value.length
  Statistics.value.averageScore = examHistoryList.value.reduce((total, exam) => total + exam.totalScore, 0) / Statistics.value.length
})
</script>
