<template>
  <div>
    <h1>Danh sách FlashCard</h1>
    <button @click="openForm(1,null,null)">Thêm FlashCard</button>
    <button @click="openImportModal">Thêm nhiều FlashCard</button>
    <div v-for="card,index in flashCardList" :key="index">
      <div>
          <button @click="openForm(2,card,index)">Sửa</button>
          <button @click="openForm(3,null,index)">Xóa</button>
      </div>
      <div>
          <img v-if="card?.imageUrl||card?.imageUrlLocal" :src="card?.imageUrlLocal || card.imageUrl">
          <audio v-if="card?.audioUrl||card?.audioUrlLocal" :src="card?.audioUrlLocal || card.audioUrl" controls></audio>
          <h2>{{ card.front.word }}</h2>
          <p>{{ card.front.phonetic }}</p>
      </div>
      <div>
          <p>{{ card.back.definition }}</p>
          <p>{{ card.back.example }}</p>
      </div>
    </div>
    <div v-if="openAddFormStatus">
      <h2 v-if="isAdding">Thêm FlashCard</h2>
      <h2 v-else>Sửa FlashCard</h2>
      <div>
        <label>Mặt trước</label>
          <label>Nội dung</label>
          <input v-model="flashCard.front.word" type="text">
          <label>Phiên âm</label>
          <input v-model="flashCard.front.phonetic" type="text">
          <label>Ảnh</label>
          <input type="file" accept="img/*" @change="handleImageUpload">
          <img v-if="flashCard.imageUrlLocal||flashCard.imageUrl" :src="flashCard.imageUrlLocal || flashCard.imageUrl" alt="Ảnh FlashCard">
          <label>Âm thanh</label>
          <input type="file" accept="audio/*" @change="handleAudioUpload">
          <audio v-if="flashCard.audioUrlLocal||flashCard.audioUrl" :src="flashCard.audioUrlLocal || flashCard.audioUrl" controls></audio>
        <label>Mặt sau</label>
          <label>Định nghĩa</label>
          <input v-model="flashCard.back.definition" type="text">
          <label>Ví dụ</label>
          <input v-model="flashCard.back.example" type="text">
      </div>
      <div>
        <button v-if="isAdding" @click="addFlashCard">Thêm</button>
        <button v-else @click="saveFlashCard">Lưu</button>
        <button @click="closeForm">Hủy</button>
      </div>
    </div>

    <div v-if="deleteStatus">
      <h3>Bạn có chắc chắn muốn xóa?</h3>
      <button @click="deleteCard">Có</button>
      <button @click="deleteStatus=false">Không</button>
    </div>

    <div v-if="showImportModal" >
      <div >
        <h3>Import FlashCard từ file</h3>
        <input type="file" @change="handleImportFile" accept=".xlsx,.xls,.csv">
        <button @click="downloadTemplate">Tải file mẫu</button>
        <button @click="showImportModal = false">Đóng</button>
      </div>
    </div>

  </div>
</template>
<script setup>
import {useRoute} from 'vue-router'
import {ref,onMounted} from 'vue'
import axiosInstance from'@/services/axiosService'
import { uploadAudio } from '@/services/audioSerrvice'
import sendImageKit from '@/services/imageService'
import { alertService } from '@/services/alertService'
import * as XLSX from 'xlsx'
const route=useRoute()
let deckId=null
const emptyFlashCard=()=>{
  return{
  _id:null,
  front:{
    word:'',
    phonetic:'',
  },
  back:{
    definition:'',
    example:''
  },
  audioUrlLocal:null,
  audioFile:'',
  audioUrl:null,
  audioId:'',
  imageUrlLocal:null,
  imageFile:'',
  imageUrl:null,
  imageId:'',}
}
const flashCardList=ref([])
const flashCard=ref(emptyFlashCard())
const isAdding=ref(false)
const openAddFormStatus=ref(false)
const deleteStatus=ref(false)
const selectedCard=ref(null)//=0 được xem là false
const showImportModal = ref(false)
//const importFile = ref(null)
const handleImageUpload=(event)=>{
  const file=event.target.files[0]
  if(!file) return
  if(flashCard.value.imageUrlLocal)
    URL.revokeObjectURL(flashCard.value.imageUrlLocal)
 else{ flashCard.value.imageFile=file
  flashCard.value.imageUrlLocal=URL.createObjectURL(file)}
}

const handleAudioUpload=(event)=>{
  const file=event.target.files[0]
  if(!file) return
  if(flashCard.value.audioUrlLocal)
    URL.revokeObjectURL(flashCard.value.audioUrlLocal)
 else{ flashCard.value.audioFile=file
  flashCard.value.audioUrlLocal=URL.createObjectURL(file)}
  flashCard.value.audioUrlLocal=URL.createObjectURL(file)
}
//
const openForm=(mode,data,index)=>{
switch(mode){
  case 1://thêm
    openAddFormStatus.value=true
    isAdding.value=true
    flashCard.value=emptyFlashCard()
    break
  case 2://sửa
    openAddFormStatus.value=true
    isAdding.value=false
    flashCard.value=data
    selectedCard.value=index
    break
  case 3://xóa
    //Xóa
    deleteStatus.value=true
    selectedCard.value=index
    break
}}
const openImportModal=()=>{
  showImportModal.value=true
}
//
const handleImportFile = async (event) => {
  const file = event.target.files[0]
  if(!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    // Chuyển đổi dữ liệu
    const flashcards = rows.map(row => ({
      front: {
        word: row.word || row.tu_vung,
        phonetic: row.phonetic || row.phien_am
      },
      back: {
        definition: row.definition || row.nghia,
        example: row.example || row.vi_du
      }
    }))

    // Upload hàng loạt
    await addMultipleFlashCards(flashcards)
  }
  reader.readAsArrayBuffer(file)
}
const downloadTemplate = () => {
  const template = [
    { word: 'Hello', phonetic: '/həˈləʊ/', definition: 'Xin chào', example: 'Hello world!' },
    { word: 'Goodbye', phonetic: '/ˌɡʊdˈbaɪ/', definition: 'Tạm biệt', example: 'Goodbye everyone!' }
  ]

  const ws = XLSX.utils.json_to_sheet(template)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.writeFile(wb, 'flashcard_template.xlsx')
}
const addMultipleFlashCards = async (flashcards) => {
  try {
    flashcards.map((n)=>{
      n.deckId=deckId
    })
    const res=await axiosInstance.post(`/cards/many/${deckId}`,flashcards)
        if(res.data.success) {
        alertService("success", 'Thêm thành công')
      }

    // Gửi từng cái một
    // let successCount = 0
    // for(let i = 0; i < flashcards.length; i++) {
    //   const card = flashcards[i]
    //   const data = {
    //     front: card.front,
    //     back: card.back,
    //     audioUrl: '',
    //     audioId: '',
    //     imageUrl: '',
    //     imageId: ''
    //   }

    //   const res = await axiosInstance.post(`/cards/${deckId}`, data)
    //   if(res.data.success) {
    //     successCount++
    //     alertService("info", `Đã thêm ${successCount}/${flashcards.length}`, 1000)
    //   }
    // }

    // alertService("success", `Thêm thành công ${successCount} flashcard!`)
    await fetchData()

  } catch {
    alertService("error", "Import thất bại")
  }
}

const fetchData=async()=>{
  await axiosInstance.get(`/cards/${deckId}`).then(res=>{
    console.log(res.data)
    flashCardList.value=res.data.data
  })
}
const addFlashCard=async()=>{
   const [imageRes, audioRes] = await Promise.all([
      flashCard.value.imageFile ? sendImageKit(flashCard.value.imageUrlLocal,flashCard.value.imageFile) : Promise.resolve(null),
      flashCard.value.audioFile ? uploadAudio(flashCard.value.audioFile) : Promise.resolve(null)
    ])

    const data = {
      front: {
        word: flashCard.value.front.word,
        phonetic: flashCard.value.front.phonetic,
      },
      back: {
        definition: flashCard.value.back.definition,
        example: flashCard.value.back.example
      },
      audioUrl: audioRes?.secure_url || '',
      audioId: audioRes?.public_id || '',
      imageUrl: imageRes?.url || '',
      imageId: imageRes?.fileId || '',
    }
    const res=await axiosInstance.post(`/cards/${deckId}`,data)
    if(res.data.success)
    {
      alertService("success","Thêm FlashCard thành công")
      flashCard.value=emptyFlashCard()
    }
    openAddFormStatus.value=false
    fetchData()
    openAddFormStatus.value=false
}
const saveFlashCard=async()=>{
    if(flashCard.value._id && selectedCard.value !== null){
   const [imageRes, audioRes] = await Promise.all([
      flashCard.value.imageFile ? sendImageKit(flashCard.value.imageUrlLocal,flashCard.value.imageFile) : Promise.resolve(null),
      flashCard.value.audioFile ? uploadAudio(flashCard.value.audioFile) : Promise.resolve(null)
    ])

    const data = {
      front: {
        word: flashCard.value.front.word,
        phonetic: flashCard.value.front.phonetic,
      },
      back: {
        definition: flashCard.value.back.definition,
        example: flashCard.value.back.example
      },
      audioUrl: audioRes?.secure_url || '',
      audioId: audioRes?.public_id || '',
      imageUrl: imageRes?.url || '',
      imageId: imageRes?.fileId || '',
    }
          const res=await axiosInstance.put(`cards/${flashCard.value._id}`,data)
          if(res.data.success)
          {
            alertService("success","Sửa FlashCard thành công")
            flashCard.value=emptyFlashCard()
          }
    }
    else if(!flashCard.value && selectedCard.value !== null){
      flashCardList.value[selectedCard.value]={...flashCard.value}
      flashCard.value=emptyFlashCard()
    }
    openAddFormStatus.value=false
}
const deleteCard=async()=>{
  if(flashCardList.value[selectedCard.value] && selectedCard.value !== null){
    await axiosInstance.delete(`/cards/${deckId}/${flashCardList.value[selectedCard.value]._id}`)
  }
  else if(!flashCardList.value[selectedCard.value] && selectedCard.value !== null){
    flashCardList.value.splice(selectedCard.value,1)
  }
  fetchData()
  deleteStatus.value=false
}
onMounted(async()=>{
  console.log(route.params.id)
  deckId=route.params.id
  console.log(deckId)
  await fetchData()
})
</script>
