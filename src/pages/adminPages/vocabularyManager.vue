<template>
  <input
  type="text"
  v-model="searchData.other"
  placeholder="Tìm từ vựng..."
/>
<select v-model='searchData.level' >
  <option disabled value="">Chọn cấp độ</option>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="C1">C1</option>
        <option value="C2">C2</option>
</select>
<select v-model="searchData.partOfSpeech">
        <option  v-for="n in partOfSpeech" :key="n" :value="n">{{ n }}</option>
</select>
<button @click="getVocabularyList(1)">Tìm</button>
  <!-- Danh sách từ vựng -->
  <p>Danh sách từ vựng</p>
<table border="1">
  <thead>
    <tr>
      <th>Từ vựng</th>
      <th>Phiên âm</th>
      <th>Nghĩa</th>
      <th>Cấp độ</th>
      <th>Từ loại</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="n in vocabularyArray" :key="n.word">
      <td><button @click="openModal(n,false)">{{ n.word }}</button></td>
      <td>{{ n.phonetic }}</td>
      <td>{{ n.meaning }}</td>
      <td>{{ n.level }}</td>
      <td>{{ n.partOfSpeech }}</td>
    </tr>
  </tbody>
</table>
<div v-for="n in totalPage" :key=n>
    <button @click="getVocabularyList(n)">{{ n }}</button>
</div>
<!-- form thêm, sửa từ vựng -->
 <div v-if="modalStatus">
  <form>
      <button type="button" @click="closeModal">Đóng</button>
      <label>Từ vựng</label>
       <input type="text" v-model="vocabulary.word" required/>
       <label>Phiên âm</label>
       <input type="text" v-model="vocabulary.phonetic" required/>
       <label>Nghĩa</label>
       <input type="text" v-model="vocabulary.meaning" required/>
       <label>Cấp độ</label>
       <select v-model="vocabulary.level">
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="C1">C1</option>
        <option value="C2">C2</option>
       </select>
       <label>Từ loại</label>
       <select v-model="vocabulary.partOfSpeech">
        <option  v-for="n in partOfSpeech" :key="n" :value="n">{{ n }}</option>
       </select>
       <label>Ví dụ</label>
       <input type="text" v-model="vocabulary.example"/>
       <label>Audio Url</label>
       <input type="text" v-model="vocabulary.audioUrl"/>
  </form>
  <div v-if="!isAddVocabulary">
    <button @click="updateVocabulary">Sửa</button>
    <button @click="deleteVocabulary">Xóa</button>
  </div>
  <div v-if="isAddVocabulary">
    <button  @click="addVocabulary">Thêm</button>
  </div>
 </div>
<!-- Kết thúc modal -->
  <button @click="openModal({},true)">Thêm từ vựng</button>

</template>
<script setup>
import {ref,onMounted} from 'vue'
import axiosInstance from '@/services/axiosService'
import { alertService } from '@/services/alertService'
const modalStatus=ref(false)
const isAddVocabulary=ref(true)
const searchData=ref({
  other:'',
  level:'',
  partOfSpeech:''
})
let partOfSpeech= [
      "noun",
      "verb",
      "auxiliary_verb",
      "modal_verb",
      "adjective",
      "adverb",
      "pronoun",
      "determiner",
      "preposition",
      "conjunction",
      "interjection",
      "numeral",
      "particle"
    ]
const vocabularyArray=ref([])

const resetData=()=>{
  return {
  word:'',
  phonetic:'',
  meaning:'',
  level:'',
  partOfSpeech: '',
  example:'',
  audioUrl:''
}
}
const vocabulary=ref(resetData())
//==========Phân trang
const page=ref(1)
const totalPage=ref(1)
//const search=ref('')
//====================
function openModal(data,bool) {
  isAddVocabulary.value=bool
  modalStatus.value=true
  vocabulary.value={...data}
}

function closeModal() {
  modalStatus.value=false
  vocabulary.value=resetData()
}
const addVocabulary=async()=>{
  if(vocabulary.value.word && vocabulary.value.phonetic && vocabulary.value.meaning )
    { console.log("addvoca",vocabulary.value)
      const res=await axiosInstance.post('vocabulary',vocabulary.value)
      if(res.data.success){
        alertService('success',"Thêm thành công")
        vocabulary.value=resetData()
        getVocabularyList()
      }
      else  alertService('error','Lỗi server, Thêm thất bại')
    }

  else alertService('error','Thiếu thông tin bắt buộc')
}
const deleteVocabulary=async()=>{
  const res=await axiosInstance.delete(`vocabulary/${vocabulary.value._id}`)
      if(res.data.success){
      alertService('success','Xóa thành công')
      vocabulary.value=resetData
      getVocabularyList()
      closeModal()
    }else alertService('error','Lỗi server, xóa thất bại')
}
const updateVocabulary=async()=>{
    const res= await axiosInstance.patch(`vocabulary/${vocabulary.value._id}`,vocabulary.value)
    if(res.data.success){
      alertService('success','Sửa thành công')
      vocabulary.value=resetData
      getVocabularyList()
      closeModal()
    }else alertService('error','Lỗi server, sửa thất bại')
}
const getVocabularyList=async(page)=>{
  const response= await axiosInstance.get('vocabulary',{
      params:{
        page:page,
        level:searchData.value.level,
        partOfSpeech:searchData.value.partOfSpeech,
        search:searchData.value.other
    }
  })
  if(response.data.success){
    console.log("vcaData",response.data)
    vocabularyArray.value=response.data.data
    totalPage.value=response.data.totalPages
  }
}
onMounted(()=>{
  closeModal()
  getVocabularyList(page.value)}
)
</script>
