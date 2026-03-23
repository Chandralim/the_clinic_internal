<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List User'" />
    <FullMClinicUser />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
import { useCommonStore } from '~/store/common';

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('mplatform*user.views')) {
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }

    },
    // 'auth',
  ],
});
</script>

