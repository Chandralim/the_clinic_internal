import { defineStore } from 'pinia';


export const useCommonStore = defineStore('common', {
  state: () => ({
    list_pabrik: ['KPN', 'KAS', 'KUS', 'ARP', 'KAP', 'SMP'],
    is_sidebar_open: false,
    loading_full: false,
    // loading: false,

    _tv: {
      filter_box: false,
      filter_model: {},
      global_keyword: {}
    }
  }),
  actions: {
    triggerSidebar(act: boolean) {
      this.is_sidebar_open = act;
    },
    reset_tv(){
      this._tv.filter_box = false;
      this._tv.filter_model = {};
      this._tv.global_keyword = {};
    }
  },
});