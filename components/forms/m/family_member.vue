<template>
    <section v-show="show" class="box-fixed">
        <div>
            <HeaderPopup :title="'Add Guardian'" :fn="fnClose" class="w-full flex align-items-center" style="color:white;" />
            <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
            <div class="w-full flex flex-col items-center grow overflow-auto">
                <div class="w-full flex flex-row flex-wrap">
    
                    <div class="w-full flex flex-col flex-wrap p-1">
                        <label for="">Type</label>
                        <select v-model="m_family.dtype">
                            <option value="GUARDIAN">Guardian</option>
                            <option value="CHILD">Child</option>
                        </select>
                        <p class="text-red-500">{{ field_errors.dtype }}</p>
                    </div>

                    <div v-if="m_family.dtype=='GUARDIAN'" class="w-full flex flex-col flex-wrap p-1">
                        <label for="">Guardian Type</label>
                        <select v-model="m_family.guardian_type">
                            <option value=""></option>
                            <option value="MOTHER">Mother</option>
                            <option value="FATHER">Father</option>
                        </select>
                        <p class="text-red-500">{{ field_errors.guardian_type }}</p>
                    </div>


                    <div v-if="m_family.dtype=='CHILD'" class="w-full flex flex-col flex-wrap p-1">
                        <label for="">Child Order</label>
                        <select v-model="m_family.child_order">
                            <option value=""></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <p class="text-red-500">{{ field_errors.child_order }}</p>
                    </div>

                    <div class="w-full flex flex-col flex-wrap p-1">
                        
                        <div class="w-full">
                            <label for="">User ID</label>
                            <button type="button" v-if="m_family.m_user.id == -1" @click="show_item=true"> Select User </button>
                            <div v-else class="ring-1 ring-gray-500 flex flex-wrap p-1">
                                <button type="button" @click="m_family.m_user = {id:-1,full_name:''}">
                                    <IconsTimes/>
                                </button>
                                {{ m_family.m_user?.id }}
                            </div>
                            <p class="text-red-500">{{ field_errors.m_user_id }}</p>
                        </div>

                        <div class="w-full">
                            <label for="">User Fullname</label>
                            <div class="card-border">
                                {{ m_family.m_user?.full_name }}
                            </div>
                        </div>

                        <div class="w-full">
                            <label for="">User Name</label>
                            <div class="card-border">
                                {{ m_family.m_user.user_name }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <div class="w-full flex items-center justify-end">
                <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
                    Cancel
                </button>
                <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
                    Save
                </button>
            </div>
            </form>
        </div>
    </section>

    <SearchSelectMUser :show="show_item" :fnClose="closeSNSItem" :fnSelect="selectSNSItem"/>

</template>

<script setup>
    const { $DateTime } = useNuxtApp()
    import { useErrorStore } from '~/store/error';
    import { useCommonStore } from '~/store/common';
    import { useAlertStore } from '~/store/alert';
    const { pointFormat } = useUtils();
    
    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        fnClose: {
            type: Function,
            required: false,
        },
        id:{
            type: Number,
            required: false,
            default: 0,
        },
        parent_id:{
            type: Number,
            required: true,
            default: 0,
        },
        p_data:{
            type:Array,
            required:true,
            default:[]
        },
        p_parent_data:{
            type:Array,
            required:true,
            default:[]
        },
    })

    const m_family_temp = {
        id: -1,
        dtype: "CHILD",
        guardian_type: "",
        child_order: "",
        m_user_id:-1,
        m_user: {
            id: -1,
            full_name: "",            
            user_name: "",            
        }
    };
    
    let m_family_loaded = {...m_family_temp};
    const m_family = ref({...m_family_temp});
    
    const token = useCookie('token');
    const field_errors = ref({})
    
    const emit = defineEmits(['setParentID']);

    
    const doSave = async () => {

        
        useCommonStore().loading_full = true;
        field_errors.value = {};
    
        const data_in = new FormData();
        if (props.parent_id > 0) {
            data_in.append("parent_id", props.parent_id);
        }
        data_in.append("dtype", m_family.value.dtype);
        data_in.append("child_order", m_family.value.child_order);
        data_in.append("guardian_type", m_family.value.guardian_type);
        data_in.append("m_user_id", m_family.value.m_user.id);
        
        let $method = "post";
    
        let id = props.id;
        if (id == 0) {
        } else {
            data_in.append("id", id);
            data_in.append("_method", "PUT");
        }
    
        const { data, error, status } = await useMyFetch("/m_family/member", {
            method: $method,
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/json',
            },
            body: data_in,
            retry: 0,
        });
        useCommonStore().loading_full = false;
        if (status.value === 'error') {
            useErrorStore().trigger(error, field_errors);
            return;
        }

        if (props.parent_id <= 0) {
            props.p_parent_data.push({
                id: data.value.parent_id,
                utc_created_at : data.value.utc_created_at,
                utc_updated_at : data.value.utc_updated_at,
            });

            emit('setParentID', data.value.parent_id);
        } else {
            let idx = props.p_parent_data.map((x) => x.id).indexOf(props.parent_id);
            if (idx > -1) {
                let parent = props.p_parent_data[idx];
                parent.utc_updated_at = data.value.utc_updated_at;
                props.p_parent_data.splice(idx,1,{...parent})
            }
        }

        
        m_family.value.utc_updated_at = data.value.utc_updated_at;
        if(props.id<=0){
            m_family.value.id = data.value.id;
            m_family.value.utc_created_at = data.value.utc_created_at;
            props.p_data.unshift(m_family.value);
        }else{
            let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
            if(idx>=-1){
                props.p_data.splice(idx,1,{...m_family.value});    
            }
        }
        props.fnClose();
    }

    const callData = async () => {
        useCommonStore().loading_full = true;
        const { data, error, status } = await useMyFetch("/m_family/member", {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/json'
            },
            params: {id:props.id},
            retry: 0,
        });
        useCommonStore().loading_full = false;
    
        if (status.value === 'error') {
            useErrorStore().trigger(error);
            return;
        }
    
        let dt =data.value.data;
        m_family.value = dt;
        m_family_loaded = {...dt};
    
    }
    
    watch(() => props.show, async(newVal, oldVal) => {
        if (newVal == true){
            m_family.value = {...m_family_temp};
            field_errors.value = {};
            if(props.id!=0)
                callData();
        }
    }, {
        immediate: true
    });

    //Start Select Account Item
    const show_item = ref(false);

    const closeSNSItem = () => {
        show_item.value = false;
    };

    const selectSNSItem = (item) => {
        m_family.value.m_user = { ...item };
        m_family.value.m_user_id = item.id;
        show_item.value = false;
    }
</script>