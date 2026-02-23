<template>
<!--rừ vựng -->
  <div >
    <button @click="open(0)">Thêm ngữ pháp</button>
    <div>
      <label>Tìm kiếm ngữ pháp</label>
      <input v-model="keyWork" @input="searchGrammar" placeholder="Tìm kiếm theo ngữ pháp, nghĩa tiếng việt, chữ viết latin"/>
    </div>
    <div>
      <label>Danh sách ngữ pháp</label>
      <ul>
        <li v-for="list in grammarList" :key="list._id">
          <div>
            <p>{{ list.pattern }}</p>
            <p>{{ list.latin }}</p>
          </div>
          <i class="bi bi-eye-fill" @click="open(1,list)">Xem</i>
          <i class="bi bi-wrench" @click="open(2,list)">Sửa</i>
          <i class="bi bi-trash-fill" @click="deleteGrammar(list._id)">Xóa</i>
        </li>
      </ul>
    </div>
  </div>
  <!--modal thêm -->
  <div class="add-Grammar" v-if="openModal===0">
    <form @submit.prevent='addGrammar'>
      <label>ngữ pháp</label>
      <input type="text" v-model="form.pattern" required/>
      <label>Giải thích</label>
      <input type="text" v-model="form.explaination" required/>
      <label>Viết kiểu latin</label>
      <input type="text" v-model="form.latin" required/>
      <label>Phân loại</label>
      <select v-model="form.level">
        <option value="N1">N1</option>
        <option value="N2">N2</option>
        <option value="N3">N3</option>
        <option value="N4">N4</option>
        <option value="N5">N5</option>
      </select>
      <label>Ví dụ</label>
      <input type="text" v-model="form.example"/>
      <label>Ảnh minh họa</label>
      <input type="file" accept="image/*" @change="onFileChange"/>
      <div>
        <img :src="urlLocal">
      </div>
      <button type="submit">Xác nhận</button>
    </form>
  </div>
  <!-- Modal xem -->
     <div class="add-Grammar" v-if="openModal===1">
      <label>ngữ pháp</label>
      <p>{{ form.pattern }}</p>
      <label>Giải thích</label>
      <p>{{ form.explaination }}</p>
      <label>Viết kiểu latin</label>
      <p>{{ form.latin }}</p>
      <label>Phân loại</label>
      <p>{{ form.level }}</p>
      <label>Ví dụ</label>
      <p>{{ form.example }}</p>
      <label>Ảnh minh họa</label>
      <div>
        <img :src="form.imageUrl">
      </div>
  </div>
  <!-- Modal sửa -->
     <div class="add-Grammar" v-if="openModal===2">
    <form @submit.prevent='updateGrammar'>
      <label>ngữ pháp</label>
      <input type="text" v-model="form.pattern"/>
      <label>Giải thích</label>
      <input type="text" v-model="form.explaination"/>
      <label>Viết kiểu latin</label>
      <input type="text" v-model="form.latin"/>
      <label>Phân loại</label>
      <select v-model="form.level">
        <option value="N1">N1</option>
        <option value="N2">N2</option>
        <option value="N3">N3</option>
        <option value="N4">N4</option>
        <option value="N5">N5</option>
      </select>
      <label>Ví dụ</label>
      <input type="text" v-model="form.example"/>
      <label>Ảnh minh họa</label>
      <input type="file" accept="image/*" @change="onFileChange"/>
      <div>
        <img :src="urlLocal||form.imageUrl">
      </div>
      <button type="submit" >Xác nhận</button>
    </form>
  </div>
</template>
<script setup>
import {ref,onMounted} from 'vue'
import axiosInstance from '@/services/axiosService'
import sendImageKit from '@/services/imageService'
//import router from '../../router/index.js'
const openModal=ref(3)
let preForm={}
const file=ref()
const urlLocal=ref()
const form=ref({
  pattern:null,
  explaination:null,
  latin:null,
  imageUrl:null,
  imageId:null,
  level:null,
  example:null
})
const keyWork=ref('')
const grammarList=ref([])
const onFileChange=(event)=>{
  file.value= event.target.files[0]
  if (urlLocal.value) {
    URL.revokeObjectURL(urlLocal.value)
  }
  urlLocal.value = URL.createObjectURL(file.value)
  console.log("ảnh local",urlLocal.value)
}

const open =(a,id)=>{
  switch(a)
  {
    case(0): openModal.value=0
             break
    case(1): openModal.value=1
             form.value={...id}
             break
    case(2): openModal.value=2
             preForm={...id}
             form.value={...id}
             break
    default: openModal.value=3
  }
  console.log("modal value",openModal.value)
}
const addGrammar=async()=>{
  try{

    const data={
      pattern:form.value.pattern,
      explaination:form.value.explaination,
      latin:form.value.latin,
      imageUrl:null,
      imageId:null,
      level:form.value.level,
      example:form.value.example
    }
    if(urlLocal.value){
      const imagekit=await sendImageKit(urlLocal.value,file.value)
      data.imageUrl=imagekit.url
      data.imageId=imagekit.fileId

    }
    const res=await axiosInstance.post('/grammar/',data)
    if(res.data.success===true){
      alert('Thêm thành công')
      URL.revokeObjectURL(urlLocal.value)
      urlLocal.value=null
    }
  }
  catch(err){
      if (urlLocal.value) {
    URL.revokeObjectURL(urlLocal.value)
  }
    console.log(err)
  }
}
const updateGrammar=async()=>{
  try{
      const data={}
      let change=0
      if(preForm.pattern!== form.value.pattern)
          {data.pattern=form.value.pattern
            change++
          }
      if(preForm.explaination!== form.value.explaination)
          {data.explaination=form.value.explaination
            change++
          }
      if(preForm.latin!== form.value.latin)
          {data.latin=form.value.latin
            change++
          }
      if(urlLocal.value)
         {
          const sendImage= await sendImageKit(urlLocal.value,file.value)
           data.imageId=sendImage.fileId
           data.imageUrl=sendImage.url
           URL.revokeObjectURL(urlLocal.value)
           change++
         }
      if(preForm.level!== form.value.level)
          {data.level=form.value.level
            change++
          }
      if(preForm.example!== form.value.example)
          {data.example=form.value.example
            change++
          }
          console.log('change',change)
        const updateVoca=await axiosInstance.patch(`/grammar/${preForm._id}`,data)
        if(updateVoca){
          alert('Sửa thành công')
        }
  }
  catch(err){
      if (urlLocal.value) {
    URL.revokeObjectURL(urlLocal.value)
  }
    console.log(err)
  }
}

const getGrammar=async()=>{
  try{
      const res=await axiosInstance.get('/grammar/')
      if(res){
        console.log('listVoca',res.data)
        grammarList.value=res.data.data
      }
  }
  catch(err){
    console.log(err)
  }
}
const deleteGrammar=async(id)=>{
  try{
    const res=await axiosInstance.delete(`/grammar/${id}`)
    if(res){
      alert("xóa thành công")
    }
  }
  catch(err){
    console.log(err)
  }
}
// onBeforeUnmount(

// )
onMounted(
() => {
  console.log('COMPONENT MOUNTED')
  getGrammar()
}
)
</script>
