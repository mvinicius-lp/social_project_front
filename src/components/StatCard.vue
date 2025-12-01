<template>
  <div class="stat-card">
    <div class="top">
      <div class="title">{{ title }}</div>
      <div class="icon"><slot name="icon"></slot></div>
    </div>
    <div class="value">{{ value }}</div>
    <div v-if="sub" class="sub">{{ sub }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  title: String,
  value: [String, Number],
  sub: { type: String, default: '' }
})
</script>

<style scoped>
.stat-card{
  background:#fff;
  border:1px solid #ebf0f6;
  padding:16px;
  border-radius:10px;
  box-shadow: 0 0 0 1px rgba(10,60,120,0.01);
}
.top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.title{ color:#6a8599; font-size:13px; }
.icon{ font-size:18px; color:#9fb5d0; }
.value{ font-size:20px; font-weight:700; color:#0e3b66; }
.sub{ color:#9aaec2; font-size:12px; margin-top:6px; }
</style>
