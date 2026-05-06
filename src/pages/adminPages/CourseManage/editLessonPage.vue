<template>
  <div class="lesson-management">
    <div class="container">
      <!-- Lesson Info -->
      <div class="card">
        <div class="card-header">
          <h2>📖 Thông tin bài học</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Tiêu đề bài học</label>
            <input type="text" v-model="lessonInfo.title" placeholder="Nhập tiêu đề bài học..." class="form-control" />
          </div>
          <div class="form-group">
            <label>Mô tả bài học</label>
            <textarea v-model="lessonInfo.description" placeholder="Nhập mô tả bài học..." class="form-control" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Block List -->
      <div class="card">
        <div class="card-header">
          <h2>📚 Phần nội dung bài học</h2>
          <button @click="openBlockStatus = true" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Thêm khối
          </button>
        </div>
        <div class="card-body">
          <div v-for="(block, blockIndex) in blockArray" :key="blockIndex" class="block-item">
            <div class="block-header">
              <div class="block-title-wrapper">
                <h3>{{ block.blockTitle }}</h3>
                <i class="bi bi-pencil-fill edit-icon" @click="openChangeBlockTitle(block, blockIndex)"></i>
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
                  <img v-if="item.imageUrl || item.imageUrlLocal" class="media-image" :src="item.imageUrlLocal || item.imageUrl" />
                  <audio v-if="item.audioUrl || item.audioUrlLocal" class="media-audio" :src="item.audioUrlLocal || item.audioUrl" controls></audio>
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
      </div>

      <!-- Practice List -->
      <div class="card">
        <div class="card-header">
          <h2>✍️ Phần luyện tập</h2>
          <button @click="questionStatus = true" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Thêm câu hỏi
          </button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Tiêu đề phần luyện tập</label>
            <input type="text" v-model="practiceInfo.title" placeholder="Nhập tiêu đề..." class="form-control" required />
          </div>
          <div class="form-group">
            <label>Mô tả phần luyện tập</label>
            <textarea v-model="practiceInfo.description" placeholder="Nhập mô tả..." class="form-control" rows="2"></textarea>
          </div>

          <div v-for="(question, index) in questionArray" :key="index" class="question-item">
            <button @click="deleteContent(index, 0, 2)" class="btn-delete-question">×</button>
            <div class="question-content">
              <img v-if="question?.image?.imageUrl || question?.image?.imageUrlLocal" class="media-image" :src="question.image.imageUrl || question.image.imageUrlLocal" />
              <audio v-if="question?.audio?.audioUrl || question?.audio?.audioUrlLocal" class="media-audio" :src="question.audio.audioUrl || question.audio.audioUrlLocal" controls></audio>
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
      </div>

      <!-- Submit Button -->
      <div class="action-buttons">
        <button @click="createLesson" class="btn btn-lg btn-success">✨ Tạo bài học</button>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="changeBlockTitleStatus" class="modal-overlay" @click.self="closeChangeBlockTitle">
      <div class="modal">
        <div class="modal-header">
          <h3>Đổi tiêu đề khối</h3>
          <button @click="closeChangeBlockTitle" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <input type="text" v-model="blockSelect.title" class="form-control" placeholder="Nhập tiêu đề mới..." />
        </div>
        <div class="modal-footer">
          <button @click="closeChangeBlockTitle" class="btn btn-secondary">Hủy</button>
          <button @click="changeBlockTitle" class="btn btn-primary">Xác nhận</button>
        </div>
      </div>
    </div>

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
let lessonID = null

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
    _id: '',
    questionText: '',
    image: {
      imageFile: null,
      imageUrlLocal: '',
      imageUrl: '',
      imageId: '',
    },
    audio: {
      audioFile: '',
      audioUrlLocal: '',
      audioUrl: '',
      audioId: '',
    },
    options: [],
    correctAnswer: 0,
    explaination: '',
    score: 0
  }
}

const getEmptyBlock = () => {
  return {
    _id: '',
    type: '',
    blockTitle: '',
    blockContent: [],
  }
}

const getEmptyBlockContent = () => {
  return {
    title: '',
    content: '',
    imageFile: null,
    audioFile: null,
    imageUrlLocal: '',
    audioUrlLocal: '',
    videoUrl: '',
    imageUrl: '',
    imageId: '',
    audioUrl: '',
    audioId: '',
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
const changeBlockTitleStatus = ref(false)
const selected = ref('')
const contentUpdateSelect = ref('')
const blockSelect = ref()
const deleteBlockArray = ref([])
const deletePractice = ref([])

const chooseType = () => {
  if (selected.value) {
    blockForm.value.type = structuredClone(selected.value)
    blockForm.value.newBlock = true
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
  blockArray.value[blockSelect.value].blockContent.push({
    type: blockContentForm.value.type,
    title: blockContentForm.value.title,
    content: blockContentForm.value.content,
    imageFile: blockContentForm.value.imageFile,
    audioFile: blockContentForm.value.audioFile,
    imageUrlLocal: blockContentForm.value.imageUrlLocal,
    audioUrlLocal: blockContentForm.value.audioUrlLocal,
    videoUrl: blockContentForm.value.videoUrl,
    imageUrl: blockContentForm.value.imageUrl,
    imageId: blockContentForm.value.imageId,
    audioUrl: blockContentForm.value.audioUrl,
    audioId: blockContentForm.value.audioId,
  })
  closeBlockContent()
}

const closeBlockContent = () => {
  openBlockContentStatus.value = false
  blockSelect.value = null
  blockContentForm.value = getEmptyBlockContent()
  contentUpdateSelect.value = null
}

const openChangeBlockTitle = (block, index) => {
  changeBlockTitleStatus.value = true
  blockSelect.value = {
    title: block.blockTitle,
    index: index
  }
}

const closeChangeBlockTitle = () => {
  blockSelect.value = ""
  changeBlockTitleStatus.value = false
}

const changeBlockTitle = () => {
  blockArray.value[blockSelect.value.index].blockTitle = structuredClone(blockSelect.value.title)
  closeChangeBlockTitle()
}

const changeBlockContent = () => {
  const { blockIndex, contentIndex } = contentUpdateSelect.value
  blockArray.value[blockIndex].blockContent[contentIndex] = {
    _id: blockContentForm.value._id,
    title: blockContentForm.value.title,
    content: blockContentForm.value.content,
    imageFile: blockContentForm.value.imageFile,
    audioFile: blockContentForm.value.audioFile,
    imageUrlLocal: blockContentForm.value.imageUrlLocal,
    audioUrlLocal: blockContentForm.value.audioUrlLocal,
    imageUrl: blockContentForm.value.imageUrl,
    imageId: blockContentForm.value.imageId,
    audioUrl: blockContentForm.value.audioUrl,
    audioId: blockContentForm.value.audioId,
    videoUrl: blockContentForm.value.videoUrl
  }
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
  if (questionForm.value.audio.audioUrlLocal) {
    URL.revokeObjectURL(questionForm.value.audio.audioUrlLocal)
  }
  questionForm.value.audio.audioUrlLocal = URL.createObjectURL(file)
  questionForm.value.audio.audioFile = file
}

const questionImageChange = (event) => {
  const file = event.target.files[0];
  if (questionForm.value.image.imageUrlLocal) {
    URL.revokeObjectURL(questionForm.value.image.imageUrlLocal)
  }
  questionForm.value.image.imageUrlLocal = URL.createObjectURL(file)
  questionForm.value.image.imageFile = file
}

const addQuestion = () => {
  questionArray.value.push({
    _id: questionForm.value._id,
    questionText: questionForm.value.questionText,
    newQuestion: true,
    image: {
      imageFile: questionForm.value.image.imageFile,
      imageUrlLocal: questionForm.value.image.imageUrlLocal,
      imageUrl: questionForm.value.image.imageUrl,
      imageId: questionForm.value.image.imageId,
    },
    audio: {
      audioFile: questionForm.value.audio.audioFile,
      audioUrlLocal: questionForm.value.audio.audioUrlLocal,
      audioUrl: questionForm.value.audio.audioUrl,
      audioId: questionForm.value.audio.audioId,
    },
    options: [...questionForm.value.options],
    correctAnswer: questionForm.value.correctAnswer,
    explaination: questionForm.value.explaination,
    score: questionForm.value.score
  })
  questionForm.value = getEmptyQuestion()
  questionStatus.value = false
}

const deleteContent = (arrayIndex, contentIndex, blockType) => {
  switch (blockType) {
    case 1:
      {
        blockArray.value[arrayIndex].blockContent.splice(contentIndex, 1)
        if (blockArray.value[arrayIndex]._id) blockArray.value[arrayIndex].change = true
        break
      }
    case 2:
      {
        if (questionArray.value[arrayIndex]._id) {
          deletePractice.value.push({ ...questionArray.value[arrayIndex] })
        }
        questionArray.value.splice(arrayIndex, 1)
        break
      }
    case 3:
      {
        if (blockArray.value[arrayIndex]._id) {
          deleteBlockArray.value.push({ ...blockArray.value[arrayIndex] })
        }
        blockArray.value.splice(arrayIndex, 1)
        break
      }
  }
}

const getLesson = async () => {
  const res = await axiosInstance.get(`lessons/${lessonID}`)
  if (res.data) {
    const data = res.data
    blockArray.value = data.blockData
    lessonInfo.value.title = data.lessonData.title
    lessonInfo.value.description = data.lessonData.description
    questionArray.value = data.lessonData.practice.content
    practiceInfo.value.title = data.lessonData.practice.title,
      practiceInfo.value.description = data.lessonData.practice.description
  }
}

const getURL = async (blockContentData) => {
  const endData = await Promise.allSettled(
    blockContentData.map(async (contentData) => {
      let imageData = {};
      let audioData = {};
      let oldImageId = ''
      let oldAudioId = ''
      if (contentData.imageUrlLocal) {
        oldImageId = contentData.imageId
        imageData = await sendImageKit(
          contentData.imageUrlLocal,
          contentData.imageFile
        );
      }
      if (contentData.audioUrlLocal) {
        oldAudioId = contentData.audioId
        audioData = await uploadAudio(contentData.audioFile);
      }
      return {
        type: contentData.type,
        title: contentData.title,
        content: contentData.content,
        oldImageId: oldImageId,
        imageUrl: imageData.url || contentData.imageUrl,
        imageId: imageData.fileId || contentData.imageId,
        oldAudioId: oldAudioId,
        audioUrl: audioData.secure_url || contentData.audioUrl,
        audioId: audioData.public_id || contentData.audioId,
      };
    })
  )
  return endData.map((n) => {
    return n.value
  });
};

const getQuestionUrl = async () => {
  const res = await Promise.allSettled(
    questionArray.value.map(async (n, index) => {
      let audioUrl = ''
      let imageUrl = ''
      let audioId = ''
      let imageId = ''
      let oldAudioId = ''
      let oldImageId = ''
      let newQuestion = false
      if (n.image.imageUrlLocal) {
        oldImageId = n?.image.imageId || ''
        const data = await sendImageKit(n.image.imageUrlLocal, n.image.imageFile)
        imageUrl = data.url
        imageId = data.fileId
      }
      if (n.audio.audioUrlLocal) {
        oldAudioId = n?.audio.audioId || ''
        const data = await uploadAudio(n.audio.audioFile)
        audioUrl = data.secure_url
        audioId = data.public_id
      }
      if (!n._id) {
        newQuestion = true
      }
      return {
        questionText: n.questionText,
        newQuestion: newQuestion,
        order: index,
        image: {
          imageUrl: imageUrl,
          imageId: imageId,
          oldImageId: oldImageId
        },
        audio: {
          audioUrl: audioUrl,
          audioId: audioId,
          oldAudioId: oldAudioId
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
        _id: n._id,
        blockTitle: n.blockTitle,
        change: n?.change,
        newBlock: n?.newBlock || false,
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
    },
    deleteBlockArray: deleteBlockArray.value,
    deletePractice: deletePractice.value
  }
  const response = await axiosInstance.put(`lessons/${courseID}/${lessonID}`, data)
  if (response.data.success) {
    alertService('success', "Tạo bài học thành công")
  }
}

onMounted(async () => {
  courseID = route.params.id
  lessonID = route.params.lessonId
  await getLesson()
})

</script>
<style scoped>
@import '../../../style/admin/course/editLessonStyle.css'
</style>
