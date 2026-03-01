// const route = useRoute();
// const router = useRouter();
export const useDownload = () => {
    const toBlob = (b64Data:any, contentType='', sliceSize=512) => {
       
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
    
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
    
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
    
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    };

    const downloadFile = (response:any,filename="download") =>{
        filename=response.filename || filename;
        const blob = toBlob(response.data, response.contentType);
        const url = URL.createObjectURL(blob);
        var download = document.createElement('a');
        download.href = url;
        download.download = filename;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);

    }


    const viewFile=(response:any,filename="download")=>{
        filename=response.filename || filename;
        const blob = toBlob(response.data, response.contentType);
        const url = URL.createObjectURL(blob);
        console.log(url);
        window.open(url, '_blank');
    };

    const downloadTxt=(filename:any,text:any)=>{
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    let el:HTMLIFrameElement | null=null;

    const printHtml = (html:any,width:any) =>{
        if(document.getElementById("print_target")){
            document.getElementById("print_target")?.remove();
        }
        el = document.createElement('iframe');
        el.setAttribute("id", "print_target");
        el.style.cssText=`width:${width}px`;  
        el.style.cssText=`height:inherit`;  
        document.body.appendChild(el);
        if(el.contentWindow){
            el.contentWindow.document.open();
            el.contentWindow.document.write(html);
        }
        window.print();
        window.onafterprint = function() {
            if(el!=null) {
                document.body.removeChild(el)
                el = null;
            };
            console.log('Printing has been completed or the print preview mode has been closed');
        };
    }

    return {
        toBlob,
        downloadFile,
        viewFile,
        downloadTxt,
        printHtml
    }
}