<template>
  <div class="course-detail-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center gap-3">
        <router-link to="/admin/courses" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h1 class="h3 mb-0">{{ course?.name || 'Chi tiết khóa học' }}</h1>
          <p class="text-muted small mb-0">{{ course?.description }}</p>
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="goToAddLessonPage(course?._id)">
        <i class="bi bi-plus-lg me-1"></i>
        Thêm bài học
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-3" v-if="course?.imgUrl">
              <img :src="course.imgUrl" alt="Ảnh khóa học" class="img-fluid rounded" />
            </div>
            <div class="col">
              <h5 class="card-title">{{ course?.name }}</h5>
              <p class="card-text text-muted">{{ course?.description }}</p>
              <p class="small text-muted mb-0">Số bài học: {{ lessonList.length }}</p>
            </div>
            <div>
              <button class="btn btn-primary mt-2" @click="openUpdateForm">Sửa thông tin</button>
            </div>
          </div>
        </div>
      </div>

      <h5 class="mb-3">Danh sách bài học</h5>
      <div v-if="lessonList.length === 0" class="card shadow-sm">
        <div class="card-body text-center text-muted py-5">
          <i class="bi bi-journal-text display-4"></i>
          <p class="mt-3 mb-1">Chưa có bài học nào.</p>
          <button type="button" class="btn btn-primary mt-2" @click="openAddLessonModal">
            Thêm bài học đầu tiên
          </button>
        </div>
      </div>

      <div v-else class="list-group">
        <div
          v-for="(lesson, index) in lessonList"
          :key="lesson._id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-secondary rounded-pill">{{ index + 1 }}</span>
            <div>
              <h6 class="mb-0">{{ lesson.title }}</h6>
              <small class="text-muted" v-if="lesson.description">{{ lesson.description }}</small>
            </div>
          </div>
          <div class="d-flex gap-1">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              @click="openEditLessonModal(course?._id,lesson?._id)"
              title="Xem chi tiết bài học"
            >
              <i class="bi bi-eye"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="confirmDeleteLesson(lesson?._id)"
              title="Xóa bài học"
            >
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem bài học -->
    <div
      v-if="lessonToView"
      class="modal d-block bg-dark bg-opacity-50"
      tabindex="-1"
      @click.self="lessonToView = null"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ lessonToView.title }}</h5>
            <button type="button" class="btn-close" @click="lessonToView = null"></button>
          </div>
          <div class="modal-body">
            <p v-if="lessonToView.description">{{ lessonToView.description }}</p>
            <p v-else class="text-muted">Chưa có mô tả.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="lessonToView = null">Đóng</button>
            <button type="button" class="btn btn-warning" @click="openEditLessonModal(lessonToView); lessonToView = null">
              Sửa bài học
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal xác nhận xóa -->
    <div
      v-if="deleteModalStatus"
      class="modal d-block bg-dark bg-opacity-50"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa bài học</h5>
            <button type="button" class="btn-close" @click="deleteModalStatus=false"></button>
          </div>
          <div class="modal-body">
            Bạn có chắc muốn xóa bài học?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="lessonToDelete = null">Hủy</button>
            <button type="button" class="btn btn-danger" @click="doDeleteLesson">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  <!-- Modal sửa thông tin khóa học -->
<div v-if="updateCourseStatus" class="modal fade show d-block bg-dark bg-opacity-50">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Cập nhật khóa học</h5>
        <button type="button" class="btn-close" @click="updateCourseStatus = false"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="updateCourse">

          <div class="mb-3">
            <label class="form-label">Tên khóa học</label>
            <input type="text" class="form-control" v-model="courseUpdateForm.name"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Ảnh</label>
            <input type="file" class="form-control" @change="onFileChange"/>
          </div>

          <div class="mb-3">
            <img class="img-fluid rounded"
                 :src="courseUpdateForm?.imgUrlLocal || courseUpdateForm?.imgUrl"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <input type="text" class="form-control" v-model="courseUpdateForm.description"/>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Xác nhận cập nhật
          </button>

        </form>
      </div>

    </div>
  </div>
</div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/services/axiosService';
import router from '@/router/index.js'
import { alertService } from '@/services/alertService';
import sendImageKit from '@/services/imageService';
const route = useRoute();
const courseId = computed(() => route.params.id);
const deleteId=ref('')
const deleteModalStatus=ref(false)
const updateCourseStatus=ref(false)
const courseUpdateForm=ref({
  name:'',
  imgUrl:'',
  imgFile:null,
  imgUrlLocal:'',
  description:''
})
const course = ref(null);
const lessonList = ref([]);
const loading = ref(true);
const error = ref('');
const addLessonModal = ref(false);
const lessonToView = ref(null);
const lessonToDelete = ref(null);
const lessonError = ref('');
const lessonForm = ref({ title: '', description: '' });
const editingLessonId = ref(null);
const goToAddLessonPage = (courseId) => {
  console.log("courseId", courseId)
  if (courseId) {
    router.push({name: 'AddLesson',params: {courseId: courseId}})
  }
};
async function fetchCourse() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axiosInstance.get(`/courses/${courseId.value}`);
    if (res.data?.success && res.data?.data) {
      course.value = res.data.data;
      lessonList.value = res.data.data.lesson || [];
    } else {
      error.value = 'Không tìm thấy khóa học.';
    }
  } catch (err) {
    console.error('fetchCourse error:', err);
    error.value = err.response?.data?.message || 'Không thể tải thông tin khóa học.';
  } finally {
    loading.value = false;
  }
}
function onFileChange(event){
  const file = event.target.files[0];
  if(courseUpdateForm.value.imgUrlLocal){
    URL.revokeObjectURL(courseUpdateForm.value.imgUrlLocal)
  }
  courseUpdateForm.value.imgUrlLocal=URL.createObjectURL(file)
  courseUpdateForm.value.imgFile=file
}
function openUpdateForm(){
  updateCourseStatus.value=true,
  courseUpdateForm.value={
  name:course.value.name,
  imgUrl:course.value.imgUrl,
  imgFile:null,
  imgUrlLocal:'',
  description:course.value.description
  }
}
async function updateCourse(){
  try{
    let image={}
    if(courseUpdateForm.value.imgUrlLocal){
      image=await sendImageKit(courseUpdateForm.value.imgUrlLocal,courseUpdateForm.value.imgFile)
    }
    const data={
      name:courseUpdateForm.value.name,
      imgUrl:image.url,
      imgId:image.fileId,
      description:courseUpdateForm.value.description
    }
    const res=await axiosInstance.patch(`courses/${courseId.value}`,data)
    if(res.data.success){
      alertService("success","Sửa thông tin khóa học thành công")
    }
    else{
      alertService("error","Sửa thông tin khóa học thất bại")
    }
    updateCourseStatus.value=false
  }
  catch{
      alertService("error","Lỗi, sửa thất bại")
  }
}
function openAddLessonModal() {
  lessonForm.value = { title: '', description: '' };
  lessonError.value = '';
  editingLessonId.value = null;
  addLessonModal.value = true;
}
function openEditLessonModal(courseId,lessonId) {
  if (courseId) {
     router.push(`/admin/courses/${courseId}/edit-lesson/${lessonId}`)
  }
}
function confirmDeleteLesson(lessonId) {
  deleteId.value = lessonId;
  console.log("deleId",deleteId.value)
  deleteModalStatus.value=true
}

async function doDeleteLesson() {
  if (!deleteId.value) return;
  try {
    const res = await axiosInstance.delete(`/lessons/${deleteId.value}`);
    deleteModalStatus.value=false
    if (res.data?.success) {
      lessonToDelete.value = null;
      await fetchCourse();
      alertService("success",res.data?.message);
    } else {
      alertService('error',res.data?.message || 'Xóa thất bại.');
    }
  } catch (err) {
    console.log(err)
    alertService('error',err.response?.data?.message || 'Có lỗi khi xóa bài học.');
  }
}

onMounted(() => {
  if (courseId.value) fetchCourse();
});
</script>

<style scoped>
.course-detail-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
