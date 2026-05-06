<template>
  <div class="lesson-management">
    <div class="container">
      <!-- Lesson Info -->
      <div class="section-card">
        <h2>Thông tin bài học</h2>
        <div class="form-group">
          <label>Tiêu đề bài học</label>
          <input type="text" v-model="lessonInfo.title" class="form-control" placeholder="Nhập tiêu đề bài học..." />
        </div>
        <div class="form-group">
          <label>Miêu tả bài học</label>
          <textarea v-model="lessonInfo.description" class="form-control" rows="3" placeholder="Nhập mô tả bài học..."></textarea>
        </div>
      </div>

      <!-- Block List -->
      <div class="section-card">
        <div class="card-header-custom">
          <h2>Phần nội dung bài học</h2>
          <button @click="openBlockStatus = true" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Thêm khối
          </button>
        </div>

        <div v-for="(block, blockIndex) in blockArray" :key="blockIndex" class="block-item">
          <div class="block-header">
            <div class="block-title-wrapper">
              <h3>{{ block.blockTitle }}</h3>
            </div>
            <div class="block-actions">
              <button @click="openAddForm(blockIndex)" class="btn btn-sm btn-success">Thêm nội dung</button>
              <button @click="deleteContent(blockIndex, 0, 3)" class="btn btn-sm btn-danger">Xóa khối</button>
            </div>
          </div>

          <div class="block-content">
            <div v-for="(item, contentIndex) in block.blockContent" :key="contentIndex" class="content-item">
              <div class="content-actions">
                <button @click="openUpdateForm(blockIndex, item, contentIndex)" class="btn btn-sm btn-info">Sửa</button>
                <button @click="deleteContent(blockIndex, contentIndex, 1)" class="btn btn-sm btn-danger">Xóa</button>
              </div>
              <div class="content-body">
                <h4 v-if="item.title">{{ item.title }}</h4>
                <video v-if="block.type === 'video'" :src="item.videoUrl" controls class="media-video"></video>
                <img v-if="item.imageUrlLocal" class="media-image" :src="item.imageUrlLocal" />
                <p v-if="item.title" class="content-text">{{ item.title }}</p>
                <audio v-if="item.audioUrlLocal" class="media-audio" :src="item.audioUrlLocal" controls></audio>
                <p v-if="item.content" class="content-text">{{ item.content }}</p>
              </div>
            </div>
            <div v-if="block.blockContent.length === 0" class="empty-state">
              <p>Chưa có nội dung nào. Hãy thêm nội dung mới!</p>
            </div>
          </div>
        </div>
        <div v-if="blockArray.length === 0" class="empty-state">
          <p>Chưa có khối học nào. Hãy thêm khối mới!</p>
        </div>
      </div>

      <!-- Practice List -->
      <div class="section-card">
        <div class="card-header-custom">
          <h2>Phần luyện tập</h2>
          <button @click="questionStatus = true" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Thêm câu hỏi
          </button>
        </div>

        <div class="form-group">
          <label>Tiêu đề phần luyện tập</label>
          <input type="text" v-model="practiceInfo.title" class="form-control" placeholder="Nhập tiêu đề..." required />
        </div>
        <div class="form-group">
          <label>Mô tả phần luyện tập</label>
          <textarea v-model="practiceInfo.description" class="form-control" rows="2" placeholder="Nhập mô tả..."></textarea>
        </div>

        <div v-for="(question, index) in questionArray" :key="index" class="question-item">
          <button @click="deleteContent(index, 0, 2)" class="btn-delete-question">×</button>
          <div class="question-content">
            <img v-if="question.imageUrlLocal" class="media-image" :src="question.imageUrlLocal" />
            <audio v-if="question.audioUrlLocal" class="media-audio" :src="question.audioUrlLocal" controls></audio>
            <p class="question-text">{{ question.questionText }}</p>
            <div class="options-list">
              <div v-for="(answer, ansIndex) in question.options" :key="ansIndex" class="option-item">
                <span class="option-number">{{ ansIndex + 1 }}.</span> {{ answer }}
              </div>
            </div>
            <div class="answer-info">
              <div class="info-row">
                <strong>Giải thích:</strong>
                <p>{{ question.explaination }}</p>
              </div>
              <div class="info-row">
                <strong>Đáp án đúng:</strong>
                <span class="correct-badge">Câu {{ question.correctAnswer }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="questionArray.length === 0" class="empty-state">
          <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!</p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="action-buttons">
        <button @click="createLesson" class="btn btn-lg btn-success">✨ Tạo bài học</button>
      </div>
    </div>

    <!-- Modal: Block Form -->
    <div v-if="openBlockStatus" class="modal-overlay" @click.self="openBlockStatus = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Thêm khối mới</h3>
          <button @click="openBlockStatus = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Loại khối</label>
            <select v-model="selected" class="form-control">
              <option v-for="(item, index) in type" :key="index" :value="typeValue[index]">
                {{ item }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Tiêu đề khối</label>
            <input type="text" v-model="blockForm.blockTitle" class="form-control" placeholder="Nhập tiêu đề khối..." required />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="openBlockStatus = false" class="btn btn-secondary">Hủy</button>
          <button @click="chooseType" class="btn btn-primary">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Modal: Block Content Form -->
    <div v-if="openBlockContentStatus" class="modal-overlay" @click.self="closeBlockContent">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ isAddBlock ? 'Thêm nội dung' : 'Sửa nội dung' }}</h3>
          <button @click="closeBlockContent" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Tiêu đề</label>
            <input type="text" v-model="blockContentForm.title" class="form-control" placeholder="Nhập tiêu đề..." />
          </div>
          <div class="form-group">
            <label>Nội dung</label>
            <textarea v-model="blockContentForm.content" class="form-control" rows="4" placeholder="Nhập nội dung..."></textarea>
          </div>
          <div class="form-group">
            <label>Chọn ảnh</label>
            <input type="file" accept="image/*" @change="onImageChange" class="form-control-file" />
            <img v-if="blockContentForm.imageUrlLocal" class="preview-image" :src="blockContentForm.imageUrlLocal" />
          </div>
          <div class="form-group">
            <label>Chọn audio</label>
            <input type="file" accept="audio/*" @change="onAudioChange" class="form-control-file" />
            <audio v-if="blockContentForm.audioUrlLocal" class="preview-audio" :src="blockContentForm.audioUrlLocal" controls></audio>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeBlockContent" class="btn btn-secondary">Hủy</button>
          <button v-if="isAddBlock" @click="addToBlock" class="btn btn-primary">Thêm mới</button>
          <button v-if="!isAddBlock" @click="changeBlockContent" class="btn btn-primary">Cập nhật</button>
        </div>
      </div>
    </div>

    <!-- Modal: Question Form -->
    <div v-if="questionStatus" class="modal-overlay" @click.self="questionStatus = false">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Thêm câu hỏi mới</h3>
          <button @click="questionStatus = false" class="modal-close">×</button>
        </div>
        <form @submit.prevent="addQuestion">
          <div class="modal-body">
            <div class="form-group">
              <label>Câu hỏi</label>
              <textarea v-model="questionForm.questionText" class="form-control" rows="3" placeholder="Nhập câu hỏi..." required></textarea>
            </div>
            <div class="form-group">
              <label>Chọn ảnh</label>
              <input type="file" @change="questionImageChange" accept="image/*" class="form-control-file" />
              <img v-if="questionForm.imageUrlLocal" class="preview-image" :src="questionForm.imageUrlLocal" />
            </div>
            <div class="form-group">
              <label>Chọn audio</label>
              <input type="file" @change="questionAudioChange" accept="audio/*" class="form-control-file" />
              <audio v-if="questionForm.audioUrlLocal" class="preview-audio" :src="questionForm.audioUrlLocal" controls></audio>
            </div>
            <div class="form-group">
              <label>Đáp án</label>
              <div v-for="n in 4" :key="n" class="answer-input">
                <span class="answer-number">{{ n }}.</span>
                <input type="text" v-model="questionForm.options[n - 1]" class="form-control" :placeholder="`Đáp án ${n}`" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Đáp án đúng</label>
                <select v-model="questionForm.correctAnswer" class="form-control">
                  <option :value="1">Câu 1</option>
                  <option :value="2">Câu 2</option>
                  <option :value="3">Câu 3</option>
                  <option :value="4">Câu 4</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label>Giải thích đáp án</label>
                <textarea v-model="questionForm.explaination" class="form-control" rows="2" placeholder="Nhập giải thích..."></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="questionStatus = false" class="btn btn-secondary">Hủy</button>
            <button type="submit" class="btn btn-primary">Thêm câu hỏi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import sendImageKit from '@/services/imageService'
import { uploadAudio } from '@/services/audioSerrvice'
import axiosInstance from '@/services/axiosService'
import { alertService } from '@/services/alertService'
import { useRoute } from 'vue-router'

const route = useRoute()
let courseID = null

const lessonInfo = ref({
  title: '',
  description: '',
})

const practiceInfo = ref({
  title: '',
  description: '',
})

const getEmptyQuestion = () => {
  return {
    questionText: '',
    imageFile: null,
    imageUrlLocal: '',
    audioFile: '',
    audioUrlLocal: '',
    options: [],
    correctAnswer: 0,
    explaination: '',
    score: 0
  }
}

const getEmptyBlock = () => {
  return {
    type: '',
    blockTitle: '',
    blockContent: [],
  }
}

const getEmptyBlockContent = () => {
  return {
    title: '',
    content: '',
    videoUrl: '',
    imageFile: null,
    audioFile: null,
    imageUrlLocal: '',
    audioUrlLocal: '',
  }
}

const type = ['Tùy chỉnh', 'video']
const typeValue = ['other', 'video']
const blockForm = ref(getEmptyBlock())
const blockContentForm = ref(getEmptyBlockContent())
const questionForm = ref(getEmptyQuestion())
const blockArray = ref([])
const questionArray = ref([])
const isAddBlock = ref(false)
const openBlockContentStatus = ref(false)
const openBlockStatus = ref(false)
const questionStatus = ref(false)
const selected = ref('')
const contentUpdateSelect = ref('')
const blockSelect = ref()

const chooseType = () => {
  if (selected.value) {
    blockForm.value.type = structuredClone(selected.value)
    blockArray.value.push({ ...blockForm.value })
    blockForm.value = getEmptyBlock()
    openBlockStatus.value = false
  }
}

const openAddForm = (index) => {
  isAddBlock.value = true
  openBlockContentStatus.value = true
  blockSelect.value = index
}

const openUpdateForm = (blockIndex, contentData, contentIndex) => {
  contentUpdateSelect.value = {
    blockIndex: blockIndex,
    contentData: contentData,
    contentIndex: contentIndex
  }
  isAddBlock.value = false
  openBlockContentStatus.value = true
  blockContentForm.value = { ...contentData }
}

const addToBlock = () => {
  blockArray.value[blockSelect.value].blockContent.push({ ...blockContentForm.value })
  closeBlockContent()
}

const closeBlockContent = () => {
  openBlockContentStatus.value = false
  blockSelect.value = null
  blockContentForm.value = getEmptyBlockContent()
  contentUpdateSelect.value = null
}

const changeBlockContent = () => {
  blockArray.value[contentUpdateSelect.value.blockIndex].blockContent[contentUpdateSelect.value.contentIndex] = blockContentForm.value
  closeBlockContent()
}

const onAudioChange = (event) => {
  const file = event.target.files[0];
  if (blockContentForm.value.audioUrlLocal) {
    URL.revokeObjectURL(blockContentForm.value.audioUrlLocal)
  }
  blockContentForm.value.audioUrlLocal = URL.createObjectURL(file)
  blockContentForm.value.audioFile = file
}

const onImageChange = (event) => {
  const file = event.target.files[0];
  if (blockContentForm.value.imageUrlLocal) {
    URL.revokeObjectURL(blockContentForm.value.imageUrlLocal)
  }
  blockContentForm.value.imageUrlLocal = URL.createObjectURL(file)
  blockContentForm.value.imageFile = file
}

const questionAudioChange = (event) => {
  const file = event.target.files[0];
  if (questionForm.value.audioUrlLocal) {
    URL.revokeObjectURL(questionForm.value.audioUrlLocal)
  }
  questionForm.value.audioUrlLocal = URL.createObjectURL(file)
  questionForm.value.audioFile = file
}

const questionImageChange = (event) => {
  const file = event.target.files[0];
  if (questionForm.value.imageUrlLocal) {
    URL.revokeObjectURL(questionForm.value.imageUrlLocal)
  }
  questionForm.value.imageUrlLocal = URL.createObjectURL(file)
  questionForm.value.imageFile = file
}

const addQuestion = () => {
  questionArray.value.push({ ...questionForm.value })
  questionForm.value = getEmptyQuestion()
  questionStatus.value = false
}

const deleteContent = (arrayIndex, contentIndex, blockType) => {
  switch (blockType) {
    case 1:
      {
        blockArray.value[arrayIndex].blockContent.splice(contentIndex, 1)
        break
      }
    case 2:
      {
        questionArray.value.splice(arrayIndex, 1)
        break
      }
    case 3:
      {
        blockArray.value.splice(arrayIndex, 1)
        break
      }
  }
}

const getURL = async (blockContentData) => {
  const endData = await Promise.allSettled(
    blockContentData.map(async (contentData) => {
      let imageData = {};
      let audioData = {};

      if (contentData.imageUrlLocal) {
        imageData = await sendImageKit(
          contentData.imageUrlLocal,
          contentData.imageFile
        );
      }
      if (contentData.audioUrlLocal) {
        audioData = await uploadAudio(contentData.audioFile);
      }
      return {
        title: contentData.title,
        content: contentData.content,
        imageUrl: imageData.url,
        imageId: imageData.fileId,
        audioUrl: audioData.secure_url,
        audioId: audioData.public_id,
      };
    })
  )
  return endData.map((n) => {
    return n.value
  });
}

const getQuestionUrl = async () => {
  const res = await Promise.allSettled(
    questionArray.value.map(async (n) => {
      let audioUrl = ''
      let imageUrl = ''
      let audioId = ''
      let imageId = ''
      if (n.imageUrlLocal) {
        const data = await sendImageKit(n.imageUrlLocal, n.imageFile)
        imageUrl = data.url
        imageId = data.fileId
      }
      if (n.audioUrlLocal) {
        const data = await uploadAudio(n.audioFile)
        audioUrl = data.secure_url
        audioId = data.public_id
      }
      return {
        questionText: n.questionText,
        image: {
          imageUrl: imageUrl,
          imageId: imageId
        },
        audio: {
          audioUrl: audioUrl,
          audioId: audioId
        },
        options: n.options,
        correctAnswer: n.correctAnswer,
        explaination: n.explaination
      }
    })
  )
  return res.map((n) => { return n.value })
}

const createLesson = async () => {
  const newBlockArray1 = await Promise.allSettled(
    blockArray.value.map(async (n, index) => {
      return {
        type: n.type,
        blockTitle: n.blockTitle,
        order: index,
        blockContent: await getURL(n.blockContent)
      }
    }),
  )
  const newBlockArray2 = newBlockArray1.map((n) => {
    return n.value
  })
  const data = {
    lessonTitle: lessonInfo.value.title,
    lessonDescripsion: lessonInfo.value.description,
    blockArray: newBlockArray2,
    practice: await getQuestionUrl(),
    practiceInfo: {
      title: practiceInfo.value.title,
      description: practiceInfo.value.description
    }
  }
  const response = await axiosInstance.post(`lessons/${courseID}`, data)
  if (response.data.success) {
    alertService('success', "Tạo bài học thành công")
  }
}

onMounted(async () => {
  courseID = route.params.id
  console.log(courseID)
})
</script>
<style scoped>
@import '../../../style//admin/course/addLessonStyle.css';
</style>
