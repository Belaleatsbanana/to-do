<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { type task, API_DATA_UPLOAD } from '../module/Task';
import axios from 'axios';
import { onBeforeRouteLeave } from 'vue-router';

let tasks = ref<task[]>([]);
let canAddTask = ref(true);
/**
 * * Add auto-scroll when button is disabled & clicked
 *  
 *  
**/
onBeforeRouteLeave((to, from, next) => {
  if (API_DATA_UPLOAD.DATA_UPLOADED) {
    API_DATA_UPLOAD.TASK_DATA = tasks.value;
  }
  next();
});

const convertDates = (taskList: any[]) => {
  return taskList.map<task>(tasky => ({
    ...tasky,
    cre_date: new Date(tasky.created_at),
    upd_date: new Date(tasky.updated_at),
  }));
};

const convertDates2 = (taskList: any) => {
  return {
    ...taskList,
    cre_date: new Date(taskList.created_at),
    upd_date: new Date(taskList.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchTasks = (async () => {
  if (!API_DATA_UPLOAD.DATA_UPLOADED) {
    try {
      const response = await axios.get(import.meta.env.VITE_TASK_API_PATH as string);
      tasks.value = convertDates(response.data);
      console.log(tasks.value);

      API_DATA_UPLOAD.DATA_UPLOADED = true;
      API_DATA_UPLOAD.TASK_DATA = tasks.value;
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
  else if (API_DATA_UPLOAD.DATA_UPLOADED) {
    tasks.value = API_DATA_UPLOAD.TASK_DATA;
  }

})();


let editingTasks = ref<task[]>([]);

const statuses = ref([
  { label: 'Pending', value: 'pending' },
  { label: 'In-Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
]);

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'success';
    case 'in-progress':
      return 'warn';
    case 'done':
      return 'danger';
    default:
      return null;
  }
};

const onRowEditSave = (event: { newData: task; index: number }) => {

  const { newData, index } = event;
  if (newData.id === 'okay') {

    axios.post(import.meta.env.VITE_TASK_API_PATH as string, newData)
      .then(response => {
        tasks.value[index] = convertDates2(response.data);
        console.log('success letsoooo');
        canAddTask.value = true;
      })
      .catch(error => {
        console.error('There was an error!', error);
        if (error.response.status === 422) {
          alert('Title & Description cannot be empty dawg');
          editingTasks.value = [...editingTasks.value, newData];
          console.log(canAddTask.value);

          return;
        }
      });

  }
  else {
    console.log(`${import.meta.env.VITE_TASK_API_PATH as string}/${newData.id}`);

    axios.put(`${import.meta.env.VITE_TASK_API_PATH as string}/${newData.id}`, newData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    tasks.value[index] = newData;
  }

};
const onRowEditInit = (event: { data: task; index: number }) => {
  console.log('Row edit init triggered', event);
  console.log(editingTasks.value.length);
  console.log(editingTasks.value);
  console.log(canAddTask.value);

};

const onRowEditCancel = (event: { data: task; index: number }) => {
  console.log('Row edit cancel triggered', event);
  console.log(editingTasks.value.length);
  console.log(canAddTask.value);

};
const addTask = () => {
  console.log(editingTasks.value.length);

  const newTask: task = {
    id: 'okay',
    title: '',
    description: '',
    status: 'pending',
    cre_date: new Date()
  };
  canAddTask.value = false;
  tasks.value.push(newTask);

  editingTasks.value = [...editingTasks.value, newTask];
  console.log(canAddTask.value);

};

const deleteTask = (index: number) => {
  if (tasks.value[index].id === 'okay') {
    tasks.value.splice(index, 1);
    canAddTask.value = true;
    console.log(canAddTask.value);
    return;
  }
  axios.delete(`${import.meta.env.VITE_TASK_API_PATH as string}/${tasks.value[index].id}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  tasks.value.splice(index, 1);
};
</script>

<template>
  <header>
    <h1>To-Do List</h1>
    <p>Here are the tasks you need to complete</p>
  </header>
  <div class="task-header">
    <div class="task-header-2">
      <h3>To add a new task click on the button</h3>
      <button class="add-task-button" @click="addTask" :disabled="!canAddTask">Add Task</button>
    </div>
  </div>
  <section>


    <DataTable v-model:editing-rows="editingTasks" :value="tasks" editMode="row" dataKey="id"
      @row-edit-save="onRowEditSave" @row-edit-init="onRowEditInit" @row-edit-cancel="onRowEditCancel">

      <Column field="title" header="Title" class="min-width-title min-height-title">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="custom-input" />
        </template>
      </Column>

      <Column field="description" header="Description" class="min-width-description min-height-description">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="custom-input" />
        </template>
      </Column>

      <Column field="status" header="Status">

        <template #body="{ data, field }">
          <Tag :value="data[field]" :severity="getStatusLabel(data[field])" />
        </template>
        <template #editor="{ data, field }">
          <Select v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value">
            <template #option="slotProps">
              <Tag :value="slotProps.option.label" :severity="getStatusLabel(slotProps.option.value)" />
            </template>
          </Select>
        </template>
      </Column>
      <Column field="cre_date" header="Creation Date">
        <template #body="{ data, field }">
          {{ data[field].toLocaleDateString() }}
        </template>
      </Column>
      <Column :rowEditor="true" bodyStyle="text-align:center"></Column>
      <Column>

        <template #body="{ index }">
          <i class="fa fa-trash-o" @click="deleteTask(index)"></i>
        </template>

      </Column>
    </DataTable>
  </section>
</template>


<style scoped>
i {
  font-size: 1.5em;
  cursor: pointer;
  padding-right: 1em;
}

.task-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.task-header-2 {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 3em;
}

.add-task-button {
  font-size: 1.5em;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  background-color: #202427;
  color: white;
  cursor: pointer;
}

.p-tag {
  font-size: 1em;
  padding: 0.5em;
}

.custom-input {
  width: 100%;
  max-width: 300px;
}

.min-width-title {
  min-width: 40%;
}

.min-height-title {
  min-height: 40px;
}

.min-width-description {
  min-width: 40%;
}

.min-height-description {
  min-height: 40px;
}

.p-datatable-table {
  width: 100%;
  border-collapse: collapse;
}

h1 {
  font-size: 5em;
}

h2 {
  font-size: 4em;
}

h3 {
  font-size: 2em;
}

header {
  text-align: center;
  margin-top: 2em;
}

p {
  font-size: 3em;
}

section {
  margin: 2em;
}

.p-datatable.p-component {
  background-color: #ff0000;
  border: 1px solid #ca0000;
  border-radius: 1em;
}

.p-datatable-header {
  background-color: #3496ff;
  color: white;
  padding: 1em;
  font-size: 1.2em;
  font-weight: bold;
}

.p-datatable-table-container {
  overflow-x: auto;
}

.p-datatable-thead {
  background-color: #f1f1f1;
}

.p-datatable-tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.p-datatable-row-editor-init,
.p-datatable-row-editor-save,
.p-datatable-row-editor-cancel {
  font-size: 1em;
  color: #007bff;
  cursor: pointer;
}

.p-datatable-row-editor-init:hover,
.p-datatable-row-editor-save:hover,
.p-datatable-row-editor-cancel:hover {
  color: #0056b3;
}

.p-datatable-loading-icon {
  font-size: 2em;
  color: #007bff;
}

.p-datatable-empty-message {
  text-align: center;
  font-size: 1.5em;
  color: #ff0000;
}
</style>
