<template>
  <div class="add-exam-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Thêm đề thi JLPT</h1>
      <router-link to="/admin/exams" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i>
        Quay lại danh sách
      </router-link>
    </div>

    <!-- Bước 1: Chọn mức độ -->
    <div v-if="stepStatus === 1" class="step-card card shadow-sm">
      <div class="card-body">
        <h2 class="h5 mb-3">Bước 1: Chọn mức độ</h2>
        <select v-model="examLevel" class="form-select form-select-lg mb-3">
          <option value="N5">N5</option>
          <option value="N4">N4</option>
          <option value="N3">N3</option>
          <option value="N2">N2</option>
          <option value="N1">N1</option>
        </select>
        <button type="button" class="btn btn-primary" @click="stepStatus = 2">Tiếp tục</button>
      </div>
    </div>

    <!-- Bước 2: Thông tin đề thi -->
    <div v-if="stepStatus === 2" class="step-card card shadow-sm">
      <div class="card-body">
        <h2 class="h5 mb-3">Bước 2: Thông tin đề thi</h2>
        <div class="mb-3">
          <label class="form-label">Tiêu đề đề thi</label>
          <input
            v-model="examForm.title"
            type="text"
            class="form-control"
            placeholder="Ví dụ: Đề thi thử JLPT N5 - Đợt 1"
          />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Phần thi</th>
                <th>Số câu hỏi</th>
                <th>Thời gian (phút)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Từ vựng</td>
                <td>
                  <input
                    v-model.number="examForm.structure.vocabulary.count"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    v-model.number="examForm.structure.vocabulary.duration"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr>
                <td>Đọc hiểu</td>
                <td>
                  <input
                    v-model.number="examForm.structure.reading.count"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    v-model.number="examForm.structure.reading.duration"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr>
                <td>Nghe hiểu</td>
                <td>
                  <input
                    v-model.number="examForm.structure.listening.count"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    v-model.number="examForm.structure.listening.duration"
                    type="number"
                    min="0"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr class="table-secondary fw-bold">
                <td>Tổng</td>
                <td>{{ totalQuestions }}</td>
                <td>{{ totalDuration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="step2Error" class="text-danger small">{{ step2Error }}</p>
        <button type="button" class="btn btn-primary me-2" @click="stepStatus = 1">Quay lại</button>
        <button type="button" class="btn btn-primary" @click="goToStep3">Tiếp tục</button>
      </div>
    </div>

    <!-- Bước 3: Thêm câu hỏi & Tạo đề -->
    <div v-if="stepStatus === 3" class="step-card">
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h2 class="h5">Đề thi: {{ examForm.title }}</h2>
          <p class="mb-0">Mức độ: <strong>{{ examLevel }}</strong></p>
          <p class="mb-0">Tổng số câu: <strong>{{ totalQuestions }}</strong></p>
          <p class="mb-0">Thời gian làm bài: <strong>{{ totalDuration }}</strong> phút</p>
          <p class="text-muted small mt-2">
            Cần thêm đủ <strong>{{ totalQuestions }}</strong> câu hỏi (hiện có {{ questionList.length }}).
          </p>
        </div>
      </div>

      <div class="add-exam-content row g-4">
        <!-- Danh sách câu hỏi đã thêm -->
        <div class="col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header">Danh sách câu hỏi</div>
            <div class="card-body">
              <div
                v-for="(n, index) in questionList"
                :key="index"
                class="border rounded p-3 mb-3 position-relative"
              >
                <div class="d-flex justify-content-end gap-1 mb-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="editQuestion(index)"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteQuestion(index)"
                  >
                    Xóa
                  </button>
                </div>
                <p class="mb-1"><strong>Câu {{ index + 1 }}:</strong> {{ n.questionText || '(Chưa có nội dung)' }}</p>
                <img
                  v-if="n.urlLocal || n.image?.imageUrl"
                  :src="n.urlLocal || n.image?.imageUrl"
                  alt="Hình câu hỏi"
                  class="img-thumbnail mb-2"
                  style="max-height: 120px"
                />
                <p v-if="n.audio?.audioUrl" class="small text-muted mb-1">Âm thanh: {{ n.audio.audioUrl }}</p>
                <p class="small mb-0">
                  Đáp án đúng: {{ (n.options && n.options[n.correctAnswer]) || '—' }}
                </p>
              </div>
              <p v-if="questionList.length === 0" class="text-muted">Chưa có câu hỏi nào. Thêm bên dưới.</p>
            </div>
          </div>
        </div>

        <!-- Form thêm câu hỏi -->
        <div class="col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header">Thêm câu hỏi (Câu {{ questionIndex }})</div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Nội dung câu hỏi <span class="text-danger">*</span></label>
                <input
                  v-model="question.questionText"
                  type="text"
                  class="form-control"
                  placeholder="Nhập nội dung câu hỏi"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Hình ảnh (tùy chọn)</label>
                <input type="file" accept="image/*" class="form-control" @change="onFileChange" />
                <img
                  v-if="question.urlLocal"
                  :src="question.urlLocal"
                  alt="Preview"
                  class="img-thumbnail mt-2"
                  style="max-height: 150px"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">URL âm thanh (tùy chọn)</label>
                <input
                  v-model="question.audio.audioUrl"
                  type="text"
                  class="form-control"
                  placeholder="https://..."
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Các đáp án <span class="text-danger">*</span></label>
                <div v-for="(_, idx) in 4" :key="idx" class="input-group mb-2">
                  <span class="input-group-text">Đáp án {{ idx + 1 }}</span>
                  <input
                    v-model="question.options[idx]"
                    type="text"
                    class="form-control"
                    :placeholder="'Nội dung đáp án ' + (idx + 1)"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Đáp án đúng</label>
                <select v-model.number="question.correctAnswer" class="form-select">
                  <option v-for="(_, idx) in 4" :key="idx" :value="idx">Đáp án {{ idx + 1 }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Giải thích đáp án (tùy chọn)</label>
                <textarea
                  v-model="question.explanation"
                  class="form-control"
                  rows="2"
                  placeholder="Giải thích đáp án"
                />
              </div>
              <button
                type="button"
                class="btn btn-success"
                :disabled="!canAddQuestion"
                @click="createQuestion"
              >
                Lưu câu hỏi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 d-flex align-items-center gap-3">
        <button type="button" class="btn btn-outline-secondary" @click="stepStatus = 2">Quay lại bước 2</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isSubmitting || questionList.length !== totalQuestions"
          @click="submitExam"
        >
          <span v-if="isSubmitting">Đang tạo đề...</span>
          <span v-else>Tạo đề thi</span>
        </button>
        <span v-if="questionList.length !== totalQuestions" class="text-muted small">
          Thêm đủ {{ totalQuestions }} câu hỏi để có thể tạo đề.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import sendImageKit from '@/services/imageService';
import axiosInstance from '@/services/axiosService';
import { ref, computed } from 'vue';

const examLevel = ref('N5');
const examForm = ref({
  title: '',
  level: 'N5',
  structure: {
    vocabulary: { count: 0, duration: 0 },
    reading: { count: 0, duration: 0 },
    listening: { count: 0, duration: 0 },
  },
});

const questionList = ref([]);
const fileList = ref([]); // file gốc cho từng câu (để upload khi submit)
const currentFile = ref(null); // file đang chọn ở form (ảnh câu hiện tại)
const question = ref(getEmptyQuestion());
const stepStatus = ref(1);
const questionIndex = ref(1);
const step2Error = ref('');
const isSubmitting = ref(false);
const editingIndex = ref(null);

function getEmptyQuestion() {
  return {
    questionText: '',
    urlLocal: '',
    image: { imageUrl: '', imageId: '' },
    audio: { audioUrl: '', audioId: '' },
    videoUrl: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    score: 1,
  };
}

const totalQuestions = computed(() => {
  const s = examForm.value.structure;
  return (s.vocabulary?.count || 0) + (s.reading?.count || 0) + (s.listening?.count || 0);
});

const totalDuration = computed(() => {
  const s = examForm.value.structure;
  return (s.vocabulary?.duration || 0) + (s.reading?.duration || 0) + (s.listening?.duration || 0);
});

const canAddQuestion = computed(() => {
  const q = question.value;
  const hasText = (q.questionText || '').trim().length > 0;
  const hasOptions = (q.options || []).filter(Boolean).length >= 2;
  return hasText && hasOptions;
});

function goToStep3() {
  step2Error.value = '';
  if (!(examForm.value.title || '').trim()) {
    step2Error.value = 'Vui lòng nhập tiêu đề đề thi.';
    return;
  }
  if (totalQuestions.value < 1) {
    step2Error.value = 'Vui lòng nhập số câu hỏi và thời gian cho từng phần thi.';
    return;
  }
  if (totalDuration.value < 1) {
    step2Error.value = 'Vui lòng nhập thời gian cho từng phần thi.';
    return;
  }
  examForm.value.level = examLevel.value;
  stepStatus.value = 3;
}

function onFileChange(event) {
  const selectedFile = event.target.files?.[0] ?? null;
  currentFile.value = selectedFile;
  if (question.value.urlLocal) {
    URL.revokeObjectURL(question.value.urlLocal);
  }
  if (selectedFile) {
    question.value.urlLocal = URL.createObjectURL(selectedFile);
  } else {
    question.value.urlLocal = '';
  }
}

function createQuestion() {
  const q = question.value;
  const options = [...(q.options || ['', '', '', ''])];
  while (options.length < 4) options.push('');
  const newItem = {
    questionText: q.questionText || '',
    urlLocal: q.urlLocal || '',
    image: { ...q.image },
    audio: { ...q.audio },
    videoUrl: q.videoUrl || '',
    options,
    correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    explanation: q.explanation || '',
    score: q.score != null ? q.score : 1,
  };
  const newFile = question.value.urlLocal ? currentFile.value : null;

  if (editingIndex.value != null) {
    questionList.value[editingIndex.value] = newItem;
    fileList.value[editingIndex.value] = newFile;
    editingIndex.value = null;
    questionIndex.value = questionList.value.length + 1;
  } else {
    questionList.value.push(newItem);
    fileList.value.push(newFile);
    questionIndex.value = questionList.value.length + 1;
  }

  currentFile.value = null;
  if (question.value.urlLocal) URL.revokeObjectURL(question.value.urlLocal);
  question.value = getEmptyQuestion();
  question.value.options = ['', '', '', ''];
}

function editQuestion(index) {
  const q = questionList.value[index];
  question.value = {
    questionText: q.questionText || '',
    urlLocal: '',
    image: { ...q.image },
    audio: { ...q.audio },
    videoUrl: q.videoUrl || '',
    options: [...(q.options || ['', '', '', ''])],
    correctAnswer: q.correctAnswer != null ? q.correctAnswer : 0,
    explanation: q.explanation || '',
    score: q.score != null ? q.score : 1,
  };
  editingIndex.value = index;
  questionIndex.value = index + 1;
}

function deleteQuestion(index) {
  questionList.value.splice(index, 1);
  fileList.value.splice(index, 1);
  if (editingIndex.value === index) {
    question.value = getEmptyQuestion();
    question.value.options = ['', '', '', ''];
    editingIndex.value = null;
  } else if (editingIndex.value != null && editingIndex.value > index) {
    editingIndex.value--;
  }
  questionIndex.value = questionList.value.length + 1;
}

async function submitExam() {
  const total = totalQuestions.value;
  if (questionList.value.length !== total) {
    alert(`Vui lòng thêm đủ ${total} câu hỏi. Hiện có ${questionList.value.length} câu.`);
    return;
  }

  isSubmitting.value = true;
  try {
    const list = questionList.value;
    const files = fileList.value;

    const getImageUrl = await Promise.allSettled(
      list.map(async (n, index) => {
        if (!n.urlLocal) return { imageUrl: '', imageId: '' };
        const file = files[index];
        if (!file) return { imageUrl: '', imageId: '' };
        const uploaded = await sendImageKit(n.urlLocal, file);
        return { imageUrl: uploaded?.url || '', imageId: uploaded?.fileId || '' };
      })
    );

    for (let i = 0; i < list.length; i++) {
      const result = getImageUrl[i];
      const value = result.status === 'fulfilled' ? result.value : {};
      list[i].image = {
        imageUrl: value.imageUrl || '',
        imageId: value.imageId || '',
      };
    }

    const payload = {
      title: examForm.value.title.trim(),
      level: examLevel.value,
      structure: examForm.value.structure,
      questions: list.map((q) => ({
        questionText: (q.questionText || '').trim(),
        image: q.image || { imageUrl: '', imageId: '' },
        audio: q.audio || { audioUrl: '', audioId: '' },
        videoUrl: q.videoUrl || '',
        options: (q.options || []).filter(Boolean).length ? q.options : ['', '', '', ''],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: (q.explanation || '').trim(),
        score: q.score != null ? q.score : 1,
      })),
    };

    const res = await axiosInstance.post('/exams', payload);
    if (res.data?.success) {
      alert('Tạo đề thi thành công!');
      stepStatus.value = 1;
      examForm.value.title = '';
      examForm.value.structure = { vocabulary: { count: 0, duration: 0 }, reading: { count: 0, duration: 0 }, listening: { count: 0, duration: 0 } };
      questionList.value = [];
      fileList.value = [];
      questionIndex.value = 1;
    } else {
      alert(res.data?.message || 'Tạo đề thi thất bại.');
    }
  } catch (err) {
    console.error('submitExam error:', err);
    alert(err.response?.data?.message || 'Có lỗi khi tạo đề thi. Vui lòng thử lại.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.add-exam-page {
  max-width: 1100px;
  margin: 0 auto;
}
.step-card {
  margin-bottom: 1.5rem;
}
.add-exam-content {
  margin-top: 1rem;
}
</style>
