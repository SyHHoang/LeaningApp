<template>
  <!-- Danh sách khóa học -->
  <div class="card p-3">
    <div class="d-flex justify-content-between ">
          <h5 class="mb-3">Danh sách khóa học</h5>
    <!-- Button thêm khóa học -->
    <button class="btn btn-primary mb-3" @click="openAddModal">
      Thêm khóa học
    </button>
    </div>

    <div class="row g-3">
      <div class="col-md-4" v-for="list in courseList" :key="list._id">

        <div class="card h-100 shadow-sm" @click="GotoLessonManagePage(list._id)">

          <img class="card-img-top"
               :src="list.imgUrl"
               style="height:160px; object-fit:cover;" />

          <div class="card-body d-flex flex-column">

            <h6 class="card-title"
                >
              {{ list.name }}
            </h6>

            <div class="mt-auto d-flex justify-content-end">
              <i class="bi bi-trash3-fill text-danger"
                 style="cursor:pointer"
                 @click="openFormDelete(list._id)">
              </i>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>


  <!-- Modal xóa khóa học -->
  <div v-if="deleteModalStatus"
       class="modal fade show d-block bg-dark bg-opacity-50">

    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Xóa khóa học</h5>
          <button class="btn-close" @click="rejectDelete"></button>
        </div>

        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa khóa học này không?</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="rejectDelete">Hủy</button>
          <button class="btn btn-danger" @click="deleteCourse">Xác nhận</button>
        </div>

      </div>
    </div>
  </div>


  <!-- Modal thêm khóa học -->
  <div v-if="addModalStatus"
       class="modal fade show d-block bg-dark bg-opacity-50">

    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Thêm khóa học mới</h5>
          <button class="btn-close" @click="closeAddModal"></button>
        </div>

        <div class="modal-body">

          <form @submit.prevent="addNewCourse">

            <div class="mb-3">
              <label class="form-label">Tên khóa học</label>
              <input type="text" class="form-control" v-model="form.name"/>
            </div>

            <div class="mb-3">
              <label class="form-label">Ảnh minh họa</label>
              <input type="file" class="form-control" accept="image/*" @change="onFileChange"/>
            </div>

            <div v-if="imageUrlLocal" class="mb-3">
              <img :src="imageUrlLocal"
                   class="img-fluid rounded shadow-sm"
                   style="max-height:200px; object-fit:cover;" />
            </div>

            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <input type="text" class="form-control" v-model="form.description"/>
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Thêm khóa học
            </button>

          </form>

          <p class="text-danger mt-2">{{ errMessage }}</p>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,onBeforeUnmount} from 'vue'
import router from '@/router/index.js'
import axiosInstance from '@/services/axiosService'
import 'vue-toastification/dist/index.css'
import sendImageKit from '@/services/imageService'
const form=ref({
  _id:null,
  name:null,
  imgUrl:null,
  imgId:"",
  description:"",
})
const imageUrlLocal=ref(null)
const file=ref()
const addModalStatus=ref(false)
const deleteModalStatus=ref(false)
const courseId=ref()
const errMessage=ref('')
const courseList=ref([])
const openFormDelete=(id)=>{
  deleteModalStatus.value=true
  courseId.value=id
}
const openAddModal=()=>{
  addModalStatus.value=true
}
const closeAddModal=()=>{
  addModalStatus.value=false
}

//delete
const deleteCourse=async()=>{
  const res= await axiosInstance.delete(`/courses/${courseId.value}`)
  if(res.data.success){
    alert('Xóa thành công')
    courseId.value=''
    getCourseList()
  }
}
const rejectDelete=()=>{
  deleteModalStatus.value=false
  courseId.value=''
}
const GotoLessonManagePage=(id)=>{
  router.push(`/admin/courses/${id}`)
}
//get
const getCourseList=async()=>{
  try{
    const getList= await axiosInstance.get('/courses/')
    if(getList){
      courseList.value=getList.data.data
      console.log('danh sách',courseList.value)
    }
  }catch(err){
    console.log(err)
  }
}
//lấy ảnh từ máy
const onFileChange = (event) => {
  file.value = event.target.files[0]
  if (!file.value) return
  // nếu chọn lại ảnh thì release ảnh cũ
  if (imageUrlLocal.value) {
    URL.revokeObjectURL(imageUrlLocal.value)
  }

  imageUrlLocal.value = URL.createObjectURL(file.value)
  console.log("ảnh local",imageUrlLocal.value)
}
//thêm khóa học
const addNewCourse=async()=>{
  try{
      if(!form.value.name||!form.value.description){
        return errMessage.value='Thiếu thông tin bắt buộc'
      }
      console.log('gửi')
      const imagekit=await sendImageKit(imageUrlLocal.value,file.value)
      form.value.imgUrl=imagekit.url
      const data={
        name:form.value.name,
        description:form.value.description,
        imgUrl:form.value.imgUrl,
        imgId:imagekit.fileId
      }
      console.log("data",data)
      //tạo mới khóa học
      const response=await axiosInstance.post('/courses/',data)
      if(response.data.success){
        URL.revokeObjectURL(imageUrlLocal.value)
        imageUrlLocal.value=null
        form.value.name=''
        form.value.description=''
        form.value.imgUrl=''
        getCourseList()
      }
      else{
        alert("Thất bại")
      }
  }catch(err){
    console.log(err)
  }
}
onMounted(

  getCourseList
)
onBeforeUnmount(() => {
  if (imageUrlLocal.value) {
    URL.revokeObjectURL(imageUrlLocal.value)
  }
})
</script>

