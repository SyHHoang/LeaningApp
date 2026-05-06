<template>
  <div class="container">
    <h2 class="title">Quản lý danh mục khóa học</h2>

    <div class="create-box">
      <input
        v-model="newCategory"
        placeholder="Nhập tên danh mục..."
        class="input"
      />
      <button class="btn primary" @click="createCategory">
        Thêm
      </button>
    </div>

    <ul class="list">
      <li v-for="cat in categories" :key="cat._id" class="card">

        <div class="left">
          <span v-if="editId !== cat._id" class="name">
            {{ cat.name }}
          </span>

          <input
            v-else
            v-model="editName"
            class="input edit"
          />
        </div>

        <div class="actions">
          <button
            v-if="editId !== cat._id"
            class="btn edit"
            @click="startEdit(cat)"
          >
            Sửa
          </button>

          <button
            v-else
            class="btn save"
            @click="updateCategory(cat._id)"
          >
            Lưu
          </button>

          <button
            class="btn delete"
            @click="deleteCategory(cat._id)"
          >
            Xóa
          </button>
        </div>

      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "@/services/axiosService";

const categories = ref([]);
const newCategory = ref("");
const editId = ref(null);
const editName = ref("");

const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get("courseCategories");
    categories.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
};

const createCategory = async () => {
  if (!newCategory.value.trim()) return;

  try {
    await axiosInstance.post("courseCategories", {
      name: newCategory.value
    });
    newCategory.value = "";
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
};

const deleteCategory = async (id) => {
  try {
    await axiosInstance.delete(`courseCategories/${id}`);
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
};

const startEdit = (cat) => {
  editId.value = cat._id;
  editName.value = cat.name;
};

const updateCategory = async (id) => {
  try {
    await axiosInstance.put(`courseCategories/${id}`, {
      name: editName.value
    });
    editId.value = null;
    editName.value = "";
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.create-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.list {
  list-style: none;
  padding: 0;
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: 0.2s;
}

.card:hover {
  background: #f1f1f1;
}

.left {
  flex: 1;
}

.name {
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 6px;
}

.input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
}

.input:focus {
  border-color: #007bff;
}

.input.edit {
  max-width: 200px;
}

.btn {
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:hover {
  background: #0056b3;
}

.btn.edit {
  background: #ffc107;
}

.btn.edit:hover {
  background: #e0a800;
}

.btn.save {
  background: #28a745;
  color: white;
}

.btn.save:hover {
  background: #1e7e34;
}

.btn.delete {
  background: #dc3545;
  color: white;
}

.btn.delete:hover {
  background: #b02a37;
}
</style>
