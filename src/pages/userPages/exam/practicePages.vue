<template>
  <div class="add-exam-page">
    <div class="d-flex justify-content-between align-items-center mb-4"></div>
    <label>Đề thi</label>
    <p>{{ examInfo.title }}</p>
    <b
      ><p>{{ fommatTime(timeLeft) }}</p></b
    >
    <!-- List -->
    <div>
      <div v-if="partList.length === 0">Chưa có phần nào</div>
      <div v-else>

    <div><button @click="getResults">Nộp bài</button></div>
        <div v-for="(part, index) in partList" :key="index">
          <p @click="goToPart(index)">
            <b>Phần {{ index + 1 }}. {{ part.title }} </b>
          </p>
        </div>
        <div v-for="(part, index) in partList" :key="index">
          <div v-show="currentPart === index">
            <p>{{ part.content }}</p>
            <div v-if="part.imageUrlLocal || part.imageUrl">
              <img :src="part.imageUrlLocal || part.imageUrl" style="max-width: 200px" />
            </div>
            <div v-if="part.audioUrlLocal || part.audioUrl">
              <audio :src="part.audioUrlLocal || part.audioUrl" controls></audio>
            </div>

            <hr />
            <!-- Danh sách khối câu hỏi -->
            <div v-if="part.type === 'many'">
              <div
                class="block-list"
                v-for="(block, blockIndex) in part.questionList"
                :key="blockIndex"
              >
                <div class="block">
                  <p> {{ block.content }}</p>
                  <img
                    v-if="block.imageUrlLocal || block.imageUrl"
                    :src="block.imageUrlLocal || block.imageUrl"
                    style="max-width: 200px"
                  />
                  <audio
                    v-if="block.audioUrlLocal || block.audioUrl"
                    :src="block.audioUrlLocal || block.audioUrl"
                    controls
                  ></audio>
                  <div
                    class="block-question"
                    v-for="(question, questionIndex) in block.question"
                    :key="questionIndex"
                  >
                    <p>
                      {{question.index}}. {{ question.questionText }}
                    </p>
                    <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
                      <input
                        type="radio"
                        :name="question.index"
                        v-model="question.userAnswer"
                        :value="optionIndex+1"
                      />
                      {{ answer[optionIndex] }}. {{ option }}<br />
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            <!-- Danh sách câu hỏi -->
            <div v-if="part.type === 'one'">
              <div v-for="(question, questionIndex) in part.questionList" :key="questionIndex">
                <b
                  ><p>{{ question.index }}.{{ question.questionText }}</p></b
                >
                <img
                  v-if="question.image.imageUrlLocal || question.image.imageUrl"
                  :src="question.image.imageUrlLocal || question.image.imageUrl"
                  style="max-width: 200px"
                />
                <audio
                  v-if="question.audio.audioUrlLocal || question.audio.audioUrl"
                  :src="question.audio.audioUrlLocal || question.audio.audioUrl"
                  controls
                ></audio>
                <div v-for="(n, optionIndex) in question.options" :key="n">
                  <input
                    type="radio"
                    :name="question.index"
                    v-model="question.userAnswer"
                    :value="optionIndex+1"
                  />
                  {{ answer[optionIndex] }}. {{ n }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <!-- ///////////////-->

  </div>
</template>

<script setup>
import axiosInstance from '@/services/axiosService'
import { alertService } from '@/services/alertService'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.id)
const startTime = ref(null)
const submitTime = ref(null)
const userExamInfo = ref({
  examId: examId.value,
  time:0,
})
const answer = ['A', 'B', 'C', 'D']
const timeLeft = ref(0)
let timer = null
/////////////////////////
const questionPartCountList = ref([])
const currentPart = ref(0)
let answerList = []
const partList = ref([])
const examInfo = ref({
  title: '',
  level: 'None',
})
/////////////////////////

const goToPart = (index) => {
  currentPart.value = index
  console.log('currentPart', currentPart.value)
}
/////////////////////////
const loadExam = async () => {
  try {
    const res = await axiosInstance.get(`/exams/user/${examId.value}`)
    console.log('res', res)
    if (!res.data?.success || !res.data?.data) {
      alertService('error', 'Không tìm thấy đề thi.')
      return
    }
    examInfo.value = res.data.examInfo
    partList.value = res.data.data
    console.log('partList', partList.value)
    let counter = 1
      partList.value.forEach((part) => {
        console.log('part', part)
        if(part.type === 'one') {
          questionPartCountList.value.push(part.questionList.length)
          console.log('questionPartCountList',part.questionList.length)
          part.questionList.forEach((element)=>{
            element.index=counter
            element.userAnswer = null
            counter++
            // answerList.push(...part.questionList)
            })}
        else{
          let totalQuestion=0
          part.questionList.forEach((element) => {
                totalQuestion+= element.question.length
                console.log('totalQuestion', totalQuestion)
                element.question.map((question) => {
                question.index=counter
                question.userAnswer = null
                 counter++
                })

              })
            questionPartCountList.value.push(totalQuestion)
            }
      })

    timeLeft.value = examInfo.value.totalTime * 60 || 0
    console.log('answerList', answerList)
  } catch (err) {
    console.error('loadExam error:', err)
  }
}
const fommatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
const getResults = async() => {
  submitTime.value = Date.now()
  partList.value.forEach((part)=>{
    if(part.type === 'one') {
          part.questionList.forEach((element)=>{
            answerList.push({
              partId: part._id,
              index: element.index,
              userAnswer: element.userAnswer,
              type: part.type,
              questionText: element.questionText,
              correctAnswer: element.correctAnswer,
              imageUrl: element.imageUrl,
              audioUrl: element.audioUrl,
              options: element.options,
              explanation: element.explaination,
              score: element.score,
          })
            // answerList.push(...part.questionList)
            })}
        else{
          part.questionList.forEach((element) => {

                element.question.map((question) => {
                  answerList.push({
                    partId: part._id,
                    index: question.index,
                    type: part.type,
                    userAnswer: question.userAnswer,
                    blockOrder: element.order,
                    blockContent: element.content,
                    blockImage: element.imageUrl,
                    blockAudio: element.audioUrl,
                    questionText: question.questionText,
                    correctAnswer: question.correctAnswer,
                    options: question.options,
                    explanation: question.explaination,
                    score: question.score,})
                })

              })
            }
  })
  alert('Nộp bài thành công!')
  let correctCount = 0
  let totalScore = 0
  answerList.forEach((item)=>{
    if(item.userAnswer !== null){

      item.resuilt = 0//chưa điền
    }
    if(item.userAnswer === item.correctAnswer){
      correctCount+=1
      totalScore+=item.score
      item.resuilt = 1//đúng
    }else{
      item.resuilt = 2//sai
    }
  })
  const data={
    correctCount: correctCount,
    answersList: answerList,
    questionPartCountList: questionPartCountList.value,
    examInfo: examInfo.value,
    time: userExamInfo.value.time,
    startTime: startTime.value,
    submitTime: submitTime.value,
    totalScore: totalScore,
  }
  console.log('data', data)
  const res=await axiosInstance.post(`/userExam/${examId.value}`, data)
  if(res.data.status === 'success'){
    alertService('success','Nộp bài thành công!')
  router.push({name:'ExamResultPage', params:{id:examId.value}})
  console.log('answerList', answerList)
}else{
  alertService('error','Nộp bài thất bại!')
}
}
onMounted(() => {
  if (examId.value) loadExam()
  startTime.value = Date.now()
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      userExamInfo.value.time.push(timeLeft.value)
      submitTime.value = Date.now()
      alert('Hết giờ!')
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}
.block {
  display: flex;
  flex-direction: column;
}
.block-list {
  display: flex;
  flex-direction: row;
}
.block-question {
  display: flex;
  flex-direction: column;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  margin-right: 8px;
}
</style>
