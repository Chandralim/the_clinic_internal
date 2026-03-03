<template>
<div class="max-h-full overflow-y-auto">
    <div v-for="(np,k) in numPages" class="border-solid border-black border-[1px]" >
        <!-- <canvas :id="'pdf_canvas'+k" /> -->
        <canvas ref="pdf_canvas"/>
    </div>
</div>
</template>

<script setup>
// import { pdfjsLib } from 'pdfjs-dist';
// import * as pdfjsLib from "pdfjs-dist";
let pdfjsLib
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs"; 
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// pdfjsLib.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

const props = defineProps({
    pdfBase64: {
        type: String,
        required: false,
    },
    pdfObjUrl:{
        type: String,
        required: false,
    }
})
const canvas = ref(null);
const numPages = ref(null);
const pdf_canvas = ref(null);

const BASE64_MARKER = ';base64,';

const convertDataURIToBinary=(dataURI)=>{
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const getAllPage=async(pdf,$page)=>{
    const page = await pdf.getPage($page+1); // Get the first page

    const viewport = page.getViewport({ scale: 1.0 });
    // const canvas = document.getElementById('pdf_canvas'+$page);
    const canvas = pdf_canvas.value[$page];
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    $page++;

    if($page<numPages.value) getAllPage(pdf,$page);
}
let loadingTask="";

onMounted(async() => {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

    const src = props.pdfObjUrl
        ? props.pdfObjUrl
        : convertDataURIToBinary(props.pdfBase64)

    loadingTask = pdfjsLib.getDocument(src)
    const pdf = await loadingTask.promise

    numPages.value = pdf.numPages
    getAllPage(pdf, 0) // masih boleh sementara
    // const page = await pdf.getPage(1); // Get the first page

    // const viewport = page.getViewport({ scale: 1.0 });
    // const canvas = document.getElementById('pdf-canvas');
    // canvas.width = viewport.width;
    // canvas.height = viewport.height;

    // const context = canvas.getContext('2d');
    // await page.render({ canvasContext: context, viewport }).promise;
    
    // pdfjsLib.getDocument(pdfasarray).then(function getPdfHelloWorld(pdf) {
    // //
    // // Fetch the first page
    // //
    //     // pdf.getPage(1).then(function getPageHelloWorld(page) {
    //     //     var scale = 1.5;
    //     //     var viewport = page.getViewport(scale);

    //     //     //
    //     //     // Prepare canvas using PDF page dimensions
    //     //     //
    //     //     var canvas = document.getElementById('pdf-canvas');
    //     //     var context = canvas.getContext('2d');
    //     //     canvas.height = viewport.height;
    //     //     canvas.width = viewport.width;

    //     //     //
    //     //     // Render PDF page into canvas context
    //     //     //
    //     //     page.render({canvasContext: context, viewport: viewport});
    //     // });
    // });
    // const base64 = props.pdfBase64.replace('data:application/pdf;base64,',"");
    // const base64 = props.pdfBase64.replace('data:application/pdf;',"");

    // const pdfData = atob(base64);

    // console.log(pdfjsLib);
    // const pdf = await pdfjsLib.PDFDocumentLoader.fromUint8Array(new Uint8Array(pdfData));
    // pdfDoc.value = pdf;

    // const canvasElement = canvas.value;
    // const context = canvasElement.getContext('2d');

    // pdf.getPage(1).render({
    //     canvasContext: context,
    //     viewport: pdf.getPage(1).getViewport({ scale: 1.5 }),
    // });
});
// watch(() => props.pdfBase64, async(newVal, oldVal) => {

// }, {
//   immediate: true
// });

onUnmounted(() => {
  loadingTask?.destroy()
})
</script>

<style>
#pdf-canvas {
    border: 1px solid black;
}
</style>