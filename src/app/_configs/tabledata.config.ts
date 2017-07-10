export const Tdata = {
  data: [],
  tableName: 'customer',
  columns: [{
      id: 'firstName',
      keyPath: 'firstName',
      name: 'FIRSTNAME',
      active: true
    },
    {
      id: 'lastName',
      keyPath: 'lastName',
      name: 'LASTNAME',
      active: true
    },
    {
      id: 'phone',
      keyPath: 'phone',
      name: 'PHONE',
      active: true
    },
    {
      id: 'email',
      keyPath: 'email',
      name: 'E-MAIL',
      active: true
    }
  ],
  filter: {
    active: false
  },
  sort: {
    active: false
  },
  buttonAction: {
    active: false
  },
  tableAction: {
    main: {
      name: 'Edit',
      procedure: 'ExecuteUpdateAction'
    },
    dropdown: [{
      name: 'Delete',
      procedure: 'ExecuteDeleteAction'
    }],
    active: true
  },
  batchAction: {
    batchExport: true,
    batchPrint: true,
    active: true
  },
  links: {
    api: {
      fetchData: '/all/customers/',
    },
    navigation: {
      mainPage: 'app/customer',
    }
  },
  rows: 10,
  compact: false,
  groupByCategory: false
}
