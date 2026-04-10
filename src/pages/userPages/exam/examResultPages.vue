<template>
  <div class="exam-result">
    <h1>Kết quả bài thi</h1>

    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div
        v-for="(count, partIndex) in data.questionPartCountList"
        :key="partIndex"
        class="part"
      >
        <h2>Phần {{ partIndex + 1 }}</h2>

        <div
          v-for="q in getQuestionsByPart(partIndex)"
          :key="q.index"
          class="question-row"
        >
          <span>
            Câu {{ q.index }}
            <b :class="getClass(q.resuilt)">
              {{ getStatusIcon(q.resuilt) }}
              ({{ getStatusText(q.resuilt) }})
            </b>
          </span>

          <button @click="openModal(q)">Xem chi tiết</button>
        </div>
      </div>
    </div>

    <!-- Modal với overlay hoàn chỉnh -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>Chi tiết câu hỏi</h3>
            <button class="modal-close" @click="closeModal">&times;</button>
          </div>

          <div v-if="selectedQuestion" class="modal-body">
            <div class="question-info">
              <span class="question-number">Câu {{ selectedQuestion.index }}</span>
              <span :class="['status-badge', getClass(selectedQuestion.resuilt)]">
                {{ getStatusIcon(selectedQuestion.resuilt) }}
                {{ getStatusText(selectedQuestion.resuilt) }}
              </span>
            </div>

            <p class="question-text">
              {{ selectedQuestion.questionText }}
            </p>

            <div v-if="selectedQuestion.blockImage" class="image-box">
              <img :src="selectedQuestion.blockImage" alt="Hình ảnh câu hỏi" />
            </div>

            <div class="options-section">
              <h4>Danh sách đáp án:</h4>
              <ul class="options">
                <li
                  v-for="(opt, idx) in selectedQuestion.options"
                  :key="idx"
                  :class="{
                    'correct-answer': isCorrectAnswer(idx),
                    'user-answer': isUserAnswer(idx),
                    'both-correct-user': isCorrectAnswer(idx) && isUserAnswer(idx)
                  }"
                >
                  <div class="option-content">
                    <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
                    <span class="option-text">{{ opt }}</span>
                    <div class="option-marks">
                      <span v-if="isCorrectAnswer(idx)" class="correct-mark">
                        ✓ Đáp án đúng
                      </span>
                      <span v-if="isUserAnswer(idx) && !isCorrectAnswer(idx)" class="wrong-mark">
                        ✗ Đáp án bạn chọn
                      </span>
                      <span v-if="isUserAnswer(idx) && isCorrectAnswer(idx)" class="correct-mark">
                        ✓ Đáp án đúng (bạn đã chọn)
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Hiển thị tổng hợp đáp án -->
            <div class="answer-summary">
              <div class="summary-item">
                <span class="summary-label">Đáp án bạn chọn:</span>
                <span class="summary-value user-choice">
                  {{ getUserAnswerText() }}
                </span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Đáp án đúng:</span>
                <span class="summary-value correct-choice">
                  {{ getCorrectAnswerText() }}
                </span>
              </div>
              <div class="summary-item" v-if="selectedQuestion.resuilt !== 0">
                <span class="summary-label">Kết quả:</span>
                <span :class="['summary-value', getClass(selectedQuestion.resuilt)]">
                  {{ getStatusIcon(selectedQuestion.resuilt) }}
                  {{ getStatusText(selectedQuestion.resuilt) }}
                  {{ selectedQuestion.resuilt === 1 ? `(+${selectedQuestion.score} điểm)` : selectedQuestion.resuilt === 2 ? `(0 điểm)` : '' }}
                </span>
              </div>
              <div class="summary-item" v-else>
                <span class="summary-label">Kết quả:</span>
                <span class="summary-value skip">
                  ⚪ Bỏ qua (0 điểm)
                </span>
              </div>
            </div>

            <div class="explanation" v-if="selectedQuestion.explanation">
              <h4>📖 Giải thích:</h4>
              <p>{{ selectedQuestion.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import axiosInstance from "@/services/axiosService"

const route = useRoute()
const examId = route.params.id

const data = ref(null)
const loading = ref(true)
const error = ref(null)

const showModal = ref(false)
const selectedQuestion = ref(null)

const fetchData = async () => {
  try {
    const res = await axiosInstance.get(`/userExam/result/${examId}`)
    data.value = res.data.data
    console.log('Dữ liệu nhận được:', data.value) // Debug
  } catch {
    error.value = "Lỗi khi load dữ liệu"
  } finally {
    loading.value = false
  }
}

const getQuestionsByPart = (partIndex) => {
  if (!data.value) return []
  const counts = data.value.questionPartCountList
  let start = 0
  for (let i = 0; i < partIndex; i++) start += counts[i]
  const end = start + counts[partIndex]
  return data.value.answersList.slice(start, end)
}

const getStatusText = (r) =>
  r === 1 ? "Đúng" : r === 0 ? "Bỏ qua" : r === 2 ? "Sai" : "?"

const getStatusIcon = (r) =>
  r === 1 ? "✅" : r === 0 ? "⚪" : r === 2 ? "❌" : ""

const getClass = (r) =>
  r === 1 ? "correct" : r === 2 ? "wrong" : "skip"

// Kiểm tra đáp án đúng
const isCorrectAnswer = (optionIndex) => {
  if (!selectedQuestion.value) return false
  // Giả sử correctAnswer là index của đáp án đúng (0-based)
  return selectedQuestion.value.correctAnswer === optionIndex
}

// Kiểm tra đáp án người dùng chọn
const isUserAnswer = (optionIndex) => {
  if (!selectedQuestion.value) return false
  // userAnswer có thể là index hoặc mảng các index (nếu multiple choice)
  if (Array.isArray(selectedQuestion.value.userAnswer)) {
    return selectedQuestion.value.userAnswer.includes(optionIndex)
  }
  return selectedQuestion.value.userAnswer === optionIndex
}

// Lấy text đáp án người dùng
const getUserAnswerText = () => {
  if (!selectedQuestion.value) return "Chưa có dữ liệu"

  const userAnswer = selectedQuestion.value.userAnswer
  const options = selectedQuestion.value.options

  if (userAnswer === undefined || userAnswer === null || userAnswer === -1) {
    return "Bỏ qua"
  }

  if (Array.isArray(userAnswer)) {
    const answers = userAnswer.map(idx => `${String.fromCharCode(65 + idx)}. ${options[idx]}`)
    return answers.join("; ")
  }

  if (userAnswer >= 0 && userAnswer < options.length) {
    return `${String.fromCharCode(65 + userAnswer)}. ${options[userAnswer]}`
  }

  return "Không xác định"
}

// Lấy text đáp án đúng
const getCorrectAnswerText = () => {
  if (!selectedQuestion.value) return "Chưa có dữ liệu"

  const correctAnswer = selectedQuestion.value.correctAnswer
  const options = selectedQuestion.value.options

  if (correctAnswer === undefined || correctAnswer === null) {
    return "Chưa có dữ liệu"
  }

  if (Array.isArray(correctAnswer)) {
    const answers = correctAnswer.map(idx => `${String.fromCharCode(65 + idx)}. ${options[idx]}`)
    return answers.join("; ")
  }

  if (correctAnswer >= 0 && correctAnswer < options.length) {
    return `${String.fromCharCode(65 + correctAnswer)}. ${options[correctAnswer]}`
  }

  return "Không xác định"
}

const openModal = (q) => {
  selectedQuestion.value = q
  showModal.value = true
  // Ngăn scroll khi modal mở
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  selectedQuestion.value = null
  // Khôi phục scroll
  document.body.style.overflow = ''
}

const handleKey = (e) => {
  if (e.key === "Escape") closeModal()
}

onMounted(() => {
  fetchData()
  window.addEventListener("keydown", handleKey)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.exam-result {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.part {
  margin-bottom: 20px;
}

.question-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.question-row:hover {
  background-color: #f5f5f5;
}

.question-row button {
  padding: 6px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.question-row button:hover {
  background-color: #1976d2;
}

.correct {
  color: #4caf50;
  font-weight: bold;
}

.wrong {
  color: #f44336;
  font-weight: bold;
}

.skip {
  color: #ff9800;
  font-weight: bold;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 750px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  transition: transform 0.2s;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.question-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.question-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.status-badge.correct {
  background-color: #e8f5e9;
  color: #4caf50;
}

.status-badge.wrong {
  background-color: #ffebee;
  color: #f44336;
}

.status-badge.skip {
  background-color: #fff3e0;
  color: #ff9800;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}

.image-box {
  margin: 20px 0;
  text-align: center;
}

.image-box img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.options-section h4 {
  margin: 20px 0 12px 0;
  color: #555;
  font-size: 1.05rem;
}

.options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.options li {
  padding: 12px 16px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ddd;
  transition: all 0.2s;
}

.option-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.option-letter {
  font-weight: bold;
  min-width: 30px;
  color: #666;
  font-size: 1rem;
}

.option-text {
  flex: 1;
  color: #333;
}

.option-marks {
  display: flex;
  gap: 10px;
  align-items: center;
}

.correct-mark {
  color: #4caf50;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 2px 8px;
  background-color: #e8f5e9;
  border-radius: 4px;
}

.wrong-mark {
  color: #f44336;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 2px 8px;
  background-color: #ffebee;
  border-radius: 4px;
}

/* Bôi xanh đáp án đúng */
.options li.correct-answer {
  background: linear-gradient(90deg, #e3f2fd 0%, #f8f9fa 100%);
  border-left-color: #2196f3;
  border-left-width: 6px;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
}

.options li.correct-answer .option-letter {
  color: #1976d2;
  font-weight: bold;
}

/* Đáp án người dùng chọn (nếu sai) */
.options li.user-answer:not(.correct-answer) {
  background: linear-gradient(90deg, #ffebee 0%, #f8f9fa 100%);
  border-left-color: #f44336;
  border-left-width: 6px;
}

/* Cả đáp án đúng và người dùng chọn */
.options li.both-correct-user {
  background: linear-gradient(90deg, #c8e6c9 0%, #f8f9fa 100%);
  border-left-color: #4caf50;
  border-left-width: 6px;
}

.options li.both-correct-user .option-letter {
  color: #2e7d32;
}

/* Answer summary */
.answer-summary {
  margin: 20px 0;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.summary-value {
  font-weight: 500;
  text-align: right;
  max-width: 60%;
}

.summary-value.user-choice {
  color: #f44336;
}

.summary-value.correct-choice {
  color: #2196f3;
  font-weight: bold;
}

.summary-value.correct {
  color: #4caf50;
}

.summary-value.wrong {
  color: #f44336;
}

.summary-value.skip {
  color: #ff9800;
}

.explanation {
  margin-top: 20px;
  padding: 16px;
  background-color: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.explanation h4 {
  margin: 0 0 8px 0;
  color: #1976d2;
}

.explanation p {
  margin: 0;
  line-height: 1.5;
  color: #555;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  padding: 10px 24px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background-color: #d32f2f;
}

/* Scrollbar styling */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 16px;
  }

  .question-text {
    font-size: 1rem;
  }

  .option-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .option-marks {
    margin-left: 30px;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .summary-value {
    text-align: left;
    max-width: 100%;
  }
}
</style>
