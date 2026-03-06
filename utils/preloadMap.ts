  export const preloadMap: Record<string, () => Promise<any>> = {
    '/': () => import('~/pages/index.vue'),
  
    '/destination_location': () =>
      import('~/pages/destination_location/index.vue'),

    '/data_ujalan': () =>
      import('~/pages/data_ujalan/index.vue'),

    '/potongan': () =>
      import('~/pages/potongan/index.vue'),

    '/extra_money': () =>
      import('~/pages/extra_money/index.vue'),
    '/extra_money/trx': () =>
      import('~/pages/extra_money/trx.vue'),



    '/data_trx_trp': () =>
      import('~/pages/data_trx_trp/index.vue'),
    '/fin_payment_req': () =>
      import('~/pages/fin_payment_req/index.vue'),
    '/data_trx_trp/transfer': () =>
      import('~/pages/data_trx_trp/transfer.vue'),
    '/data_trx_trp/ticket': () =>
      import('~/pages/data_trx_trp/ticket.vue'),
    '/data_trx_trp/ritase': () =>
      import('~/pages/data_trx_trp/ritase.vue'),
    '/data_trx_trp/absen': () =>
      import('~/pages/data_trx_trp/absen.vue'),

    // '/data_trx_trp/ticket_over': () =>
    //   import('~/pages/data_trx_trp/ticket_over.vue'),

    // '/data_trx_trp/transfer_mandiri': () =>
    //   import('~/pages/data_trx_trp/transfer_mandiri.vue'),



    '/data_standby': () =>
      import('~/pages/data_standby/index.vue'),
    '/data_standby/trx': () =>
      import('~/pages/data_standby/trx.vue'),

    '/vehicle': () =>
      import('~/pages/vehicle/index.vue'),

    '/employee': () =>
      import('~/pages/employee/index.vue'),

    '/salary_paid': () =>
      import('~/pages/salary_paid/index.vue'),
    
    '/salary_paid/rpt': () =>
      import('~/pages/salary_paid/rpt.vue'),
    
    '/salary_bonus': () =>
      import('~/pages/salary_bonus/index.vue'),


    '/user': () =>
      import('~/pages/user/index.vue'),
    
  

    '/permission_group': () =>
      import('~/pages/permission_group/index.vue'),
      
  
    '/report_trx_trp': () =>
      import('~/pages/report_trx_trp/index.vue'),
    '/report_trx_trp/finance': () =>
      import('~/pages/report_trx_trp/finance.vue'),
  
    '/report/ramp': () =>
      import('~/pages/report/ramp.vue'),
    '/report/ast_n_driver': () =>
      import('~/pages/report/ast_n_driver.vue'),
    '/report/distance': () =>
      import('~/pages/report/distance.vue'),


    // '/profile': () =>
    //   import('~/pages/profile/index.vue'),
    // '/profile/change_password': () =>
      // import('~/pages/profile/change_password.vue'),



  
    // '/nolog': () =>
    //   import('~/pages/nolog/index.vue'),

    // '/upload_image': () =>
    //   import('~/pages/upload_image/index.vue'),


  }