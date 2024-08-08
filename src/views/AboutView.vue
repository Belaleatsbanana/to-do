<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToTaskPage = () => {
  router.push({ name: 'taskPage' });
};
</script>

<template>
  <div class="about">
    <h1>Welcome!</h1>
    <p>
      This is a simple to-do list application built with Vue 3 and the Composition API. It demonstrates how to use the
      Composition API to manage state and perform CRUD operations on a list of tasks.
    </p>
    <p>
      The application allows you to add, edit, and delete tasks. It also demonstrates how to use the Composition API
      to manage form state and perform form validation.
    </p>
    <div class="in-liner">
      <div>
        <p>
          The application uses the following:
        </p>
        <ul>
          <li>Vue 3</li>
          <li>Composition API</li>
          <li>Vue Router</li>
          <li>Axios</li>
        </ul>
      </div>
      <button @click="goToTaskPage">Go To Task Page</button>
    </div>
  </div>
</template>

<style scoped>
.in-liner {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

button {
  font-size: 1.5em;
  padding: 0.5em 1em;
  border: 3px solid #ccc;
  border-radius: 0.5em;
  background-color: #202427;
  color: white;
  height: 50%;
  cursor: pointer;
  align-self: center;
  box-shadow: 0 0 16px rgba(255, 100, 100, 0.2);
}

button:active {
  background-color: rgb(43, 26, 26);
}

.about {
  padding: 2rem;
  text-align: center;
  flex: 1;
  flex-direction: column;
}

h1 {
  font-size: 3em;
  margin-bottom: 1em;
}

p {
  font-size: 1.2em;
  text-align: left;
  margin-bottom: 1em;
}

ul {
  font-size: 1.2em;
  text-align: left;
  padding: 1em 2em;
  border: 1px solid #ccc;
  border-radius: 1em;
  list-style-type: none;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
