<template>
  <div class="w-full h-full flex flex-col">
    <TheHeader :title="'List User'" />
    <FullUser  :p_callData='true'/>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
import { useCommonStore } from '@core/store/common';

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('platform*user.views')) {
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

</script>
