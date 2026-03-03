<template>
    <div v-if="value" class="w-full flex items-center justify-center">
        <IconsDocJPEG v-if="value.match(/image\/jpeg/)"/>
        <IconsDocJPG v-if="value.match(/image\/jpg/)"/>
        <IconsDocPNG v-if="value.match(/image\/png/)"/>
        <IconsDocPDF v-if="value.match(/application\/pdf/)"/>
    </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [String , null],
    required: true,
    default: "",
  },
})
</script>