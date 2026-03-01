// kecualikan,sertakan
export class SelectList {
    dref = {};
    base = [];

    iconWithKey = {}
    textWithKey = {}
    kWithKey = []

    buildRef(dref) {
        this.dref = dref;
    }

    build(objx) {
        if (typeof objx !== 'object' || objx === null) {
            this.dref.value = {};
        } else {
            this.dref.value = objx;
        }

    }

    buildStruct() {
        this.base.forEach(x => {
            this.iconWithKey[x.key] = x.icon;
            this.textWithKey[x.key] = x.text;
            this.kWithKey.push(x.key);
        });
    }

    toData(data, sub) {
        data.value[sub] = JSON.parse(JSON.stringify(this.dref.value));
    }

    // insertData() {

    // }

    // buildList(source_list) {
    //     console.log("temp_source");
    //     console.log(this.sertakankey);
    //     let filtered_source = source_list.value.map(obj => {
    //         // Menggunakan .reduce() untuk membangun objek baru
    //         return this.sertakankey.reduce((newObj, key) => {
    //             // Memeriksa apakah key ada di objek sumber sebelum ditambahkan
    //             if (obj.hasOwnProperty(key)) {
    //                 newObj[key] = obj[key];
    //             }
    //             return newObj;
    //         }, {}); // Inisialisasi dengan objek kosong {}
    //     });
    //     console.log("filtered_source");
    //     console.log(filtered_source);
    //     // this.list = JSON.parse(JSON.stringify(source_list.value));
    //     // this.sertakankey.forEach(x => {

    //     // })
    //     filtered_source.forEach((x, y) => {
    //         let temp = JSON.parse(JSON.stringify(this.struktur));
    //         Object.keys(x).forEach((z) => {
    //             temp._[z].val = x[z];
    //         });

    //         // this.sertakankey.forEach(z => {
    //         //     temp._[z].val = x[z];
    //         // });
    //         this.list.push(JSON.parse(JSON.stringify(temp)));
    //     })

    //     console.log("filtered_source");
    //     console.log(filtered_source);

    // }



    // toSource(sub) {
    //     this.sertakankey.forEach(x => {
    //         this.selected_list._[x].val = "";
    //     })
    // }



    // // constructor(myobj) {

    // //     this.myobj = myobj


    // // }

    // sayHello() {
    //     return `Hello from ${this.name}`
    // }
}