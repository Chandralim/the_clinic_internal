<script lang="ts" setup>
import { useCommonStore } from '~/store/common';
useCommonStore().loading_full = false;

</script>
<template>
    <Header :title="'Dashboard'" />

    <div class="flex grow flex-col justify-center px-6 py-12 lg:px-8 overflow-auto">
        index <br />
    </div>
</template>