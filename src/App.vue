<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

body {
  background-color: #f0f2f5;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  margin: 0;
}

div#app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
</style>