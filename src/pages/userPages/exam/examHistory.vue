<template>
  <h2 class="page-title">Lịch sử thi</h2>
  <div class="search-bar">
    <div class="search-element">
      <label><strong>Lọc theo ngày thi:</strong></label>
      <select v-model="examDate">
        <option :value="0">Tất cả</option>
        <option :value="7">7 ngày gần đây</option>
        <option :value="30">30 ngày gần đây</option>
        <option :value="90">90 ngày gần đây</option>
      </select>
      <i class="bi bi-search" @click="loadExamHistory(1,examDate)"></i>
    </div>
  </div>
  <div>
  </div>
  <div v-if="examHistoryList.length === 0">
    <p>Không có lịch sử thi nào.</p>
  </div>
  <div v-else class="exam-history-list">
    <div v-for="(history, index) in examHistoryList" :key="index" class="exam-history-item"
      @click="goToDetail(history._id)"
      >
      <div>
      <p><strong>Kỳ thi:</strong> {{ history.examInfo.title }}</p>
      <p><strong>Ngày thi:</strong> {{ new Date(history.submitTime).toLocaleString() }}</p>
      <p><strong>Điểm số:</strong> {{ history.totalScore }}</p>
      <p><strong>Số câu trả lời đúng:</strong> {{ history.correctCount }}</p>
      </div>
    </div>
</div>
<div class="total-page">
  <p v-for="page in totalPage" :key="page" @click="loadExamHistory(page)">{{ page }}</p>
</div>
</template>
<script setup>
import {ref,onMounted} from 'vue'
import { useRouter,useRoute} from 'vue-router';
import axiosInstance from '@/services/axiosService';
import { alertService } from '@/services/alertService';
const examDate = ref('')
const router=useRouter()
const route=useRoute()
const Statistics=ref({
  length:0,
  averageScore:0,
})
let totalPage=0
const examHistoryList = ref([])
const changeURL=(page,examDate)=>{
    router.push({
    query: {
      page,
      date:examDate
    },
  });
}
const goToDetail=(id)=>{
  router.push({ name: 'ExamResultPage', params: { id:id } })
}
const loadExamHistory = async(page,examDate)=>{
  try {
    const res = await axiosInstance.get('/userExam/history',
      {params:{
        page:page,
        date:examDate
      }}
    )
    console.log("lịch sử",res.data)
    if(res.data.status === 'success'){
      totalPage=res.data.pagination.totalPage
      examHistoryList.value = res.data.data
      changeURL(page,examDate)
    }else{
      alertService('error','Không thể tải lịch sử thi')
    }
  } catch {
    alertService('error','error','Đã xảy ra lỗi khi tải lịch sử thi')
  }
}
onMounted(async ()=>{
  const page=route.query.page||1
  const date=route.query.date||null
  await loadExamHistory(page,date)
  Statistics.value.length = examHistoryList.value.length
  Statistics.value.averageScore = examHistoryList.value.reduce((total, exam) => total + exam.totalScore, 0) / Statistics.value.length
})
</script>
<style>
@import '../../../style/user/exam/examHistoryStyle.css'
</style>
