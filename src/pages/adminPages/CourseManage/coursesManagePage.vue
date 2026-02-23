<template>
  <button @click="openAddModal">Thêm khóa học</button>
  <div class="course-lists">
    <div>Danh sách khóa học</div>
    <div v-for="list in courseList" :key="list._id">
      <div >
        <img :src="list.imgUrl"/>
        <p  @click="GotoLessonManagePage(list._id)">{{list.name }}</p>
        <i class="bi bi-arrow-repeat" @click="openUpdateModal(list)"></i>
        <i class="bi bi-trash3-fill" @click="openFormDelete(list._id)"></i>
      </div>
    </div>
  </div>
  <div class="delete-course" v-if="deleteModalStatus">
    <p>Bạn có chắc chắn muốn khóa khóa học này hay không?</p>
    <button @click="deleteCourse">Xác nhận</button>
    <button @click="rejectDelete">Hủy bỏ</button>
  </div>
  <div class="add-course-modal" v-if="addModalStatus">
      <div class="header">
        <i @click="closeAddModal"></i>
      </div>
      <div class="body">
        <form @submit.prevent="addNewCourse">
          <label>Tên khóa học</label>
          <input type="text" v-model="form.name"/>
          <label>Ảnh minh họa</label>
          <input type="file" accept="image/*" @change="onFileChange" />
          <div v-if="imageUrlLocal" style="margin-top: 16px">
            <img :src="imageUrlLocal" alt="preview" style="max-width: 300px" />
          </div>
          <label>Mô tả</label>
          <input type="text" v-model="form.description"/>
          <button type="submit">Thêm mới</button>
        </form>
        <p>{{ errMessage }}</p>
      </div>
  </div>
    <div class="update-course-modal" v-if="updateModalStatus">
      <div class="header">
        <i @click="closeUpdateModal"></i>
      </div>
      <div class="body">
        <form @submit.prevent="updateCourse">
          <label>Tên khóa học</label>
          <input type="text" v-model="form.name"/>
          <label>Ảnh minh họa</label>
          <input type="file" accept="image/*" @change="onFileChange" />
          <img :src="imageUrlLocal||form.imgUrl" alt="preview" style="max-width: 300px" />
          <label>Mô tả</label>
          <input type="text" v-model="form.description"/>
          <button type="submit">Cập nhật</button>
        </form>
        <p>{{ errMessage }}</p>
      </div>
  </div>
</template>
<script setup>
import { ref,onMounted,onBeforeUnmount} from 'vue'
import axiosInstance from '@/services/axiosService'
import 'vue-toastification/dist/index.css'
import sendImageKit from '@/services/imageService'
const form=ref({
  _id:null,
  name:null,
  imgUrl:null,
  description:null,
  oldImgUrlLoca:null
})
const imageUrlLocal=ref(null)
let preform
const file=ref()
const addModalStatus=ref(false)
const updateModalStatus=ref(false)
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
const openUpdateModal=(list)=>{
  updateModalStatus.value=true
  form.value=list
  preform={...form.value}
}
const closeUpdateModal=()=>{
  updateModalStatus.value=false
}
//delete
const deleteCourse=async()=>{
  const data={
    oldImgUrl:form.value.imgUrl
  }
  const res= await axiosInstance.delete(`/courses/${courseId.value}`,data)
  if(res){
    alert('Xóa thành công')
    courseId.value=''
  }
}
const rejectDelete=()=>{
  deleteModalStatus.value=false
  courseId.value=''
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
        oldImgUrlLocal:imageUrlLocal.value
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
const updateCourse=async()=>{
  try{
      const data={}
      if(preform.name!==form.value.name)
            data.name=form.value.name
      if(preform.description!==form.value.description)
            data.description=form.value.description
      if(preform.oldImgUrlLocal!==imageUrlLocal.value&&imageUrlLocal.value!==null)
            data.oldImgUrl=form.value.imgUrl
            const imagekit=await sendImageKit(imageUrlLocal.value,file.value)
            data.imgUrl=imagekit.url
            data.oldImgUrlLocal=imageUrlLocal.value
            console.log("có gọi")
      if(Object.keys(data).length !== 0)
      {
        const response=await axiosInstance.put(`/courses/${form.value._id}`,data)
      if(response.data.success){
        alert('Cập nhật thành công')
        URL.revokeObjectURL(imageUrlLocal.value)
      }
      else{
        alert("Thất bại")
      }}
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
