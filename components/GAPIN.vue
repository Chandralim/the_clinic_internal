<template lang="html">
  <!-- <div></div> -->
  <div v-if="show == 0" class="flex items-center justify-center absolute top-0 left-0 z-10 p-3 w-full h-full bg-black bg-opacity-80">
    <form action="#" class="flex items-center max-w-xs w-full relative bg-white border-solid border-gray-600 border-2 p-3 flex-col flex-wrap">

      <div class="w-full">
        Enter PIN
        <input ref="it_pin" type="text" class="w-full" v-model="pin">
      </div>

      <div class="flex w-full justify-between mt-5">
        <button type="submit" @click.prevent="timeoutStart()" class="w-full bg-blue-500 border-blue-500 border-solid border-2 p-1 text-white mr-2"> 
          Submit 
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';
const props = defineProps({
  show: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['setTimeout']);
const it_pin = ref(null);

onMounted(()=>{
  setTimeout(()=>{
    it_pin.value.focus();
  },1);
})

const field_errors = ref({})
const token = useDynamicPathCookie('token');

const pin = ref("");
const timeout_limit = ref(0); //15 menit = 900 detik x 1000 millis

const timeoutStart = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("pin", pin.value);

  let $method = "post";

  const { data, error, status } = await useMyFetch("/ga_pin", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  emit('setTimeout',data.value);
  timeout_limit.value = data.value;
  pin.value = "";
  startCounting();
}


let interval = null;
const startCounting = ()=>{
  if(interval==null){
    interval = setInterval(()=>{
      timeout_limit.value--;
      if(timeout_limit.value<=0){
        clearInterval(interval);
        interval = null;
        emit('setTimeout',0);
      }
    },1000);
  }
};


onUnmounted(()=>{
  clearInterval(interval);
  interval = null;
  emit('setTimeout',0);
});
</script>
