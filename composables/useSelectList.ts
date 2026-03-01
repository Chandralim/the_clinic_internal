
export const useSelectList = () => {
    const toData = (data: any, source: any, sub: any) => {
        data.value[sub + "_id"] = source.value.id;
        data.value[sub].code = source.value._.code.val + "test";
        data.value[sub].name = source.value._.name.val + "coba";
        // console.log(route)
        // console.log(router)
        // console.log(this.$router)

    };

    const toSource = (data: any, source: any, sub: any) => {
        // console.log(route)
        // console.log(router)
        // console.log(this.$router)

    };

    return {
        toData,
        toSource,
    }
}