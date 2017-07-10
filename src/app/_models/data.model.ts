export interface Dropdown {
  name: string;
  procedure: string;
}

export interface Icon {
  id: string;
  className: string;
  type?: string;
}

export interface TableData {
  data: any;
  tableName: string;
  serialColumn?: boolean;
  columns: [{
    id: string;
    name: string;
    keyPath?: string;
    active: boolean;
    image?: {
      id: string;
      keyPath: string;
    };
    iconId?: string;
    dateFilter?: boolean;
  }];
  filter: {
    filters?: [{
      id: string;
      name: string;
    }];
    filterBy?: {
      id: string;
      name: string;
    };
    placeholder?: string;
    active: boolean;
  };
  sort: {
    sorters?: [{
      id: string;
      name: string;
    }];
    sortBy?: {
      id: string;
      name: string;
      order: number;
    };
    active: boolean;
  };
  buttonAction: {
    main?: {
      name: string;
      procedure: string;
    };
    dropdown?: Dropdown[];
    active: boolean;
  };
  tableAction: {
    main?: {
      name: string;
      procedure: string;
    };
    dropdown?: Dropdown[];
    active: boolean;
  };
  batchAction: {
    dropdown?: Dropdown[];
    batchExport?: boolean;
    batchPrint?: boolean;
    active: boolean;
  };
  links: {
    api?: {
      fetchData?: string;
      fetchItem?: string;
      deleteItem?: string;
      updateItem?: string;
      createItem?: string;
      otherLink?: any;
    };
    navigation: {
      mainPage: string;
      updatePage?: string;
      createPage?: string;
      otherPage?: any;
    };
  };
icons?: Icon[];
rows: number;
compact: boolean;
groupByCategory: boolean;
}

export interface EventData {
  selectedItem?: any;
  selectedIds?: string[];
  selectedProcedure: string;
  queryParams?: any;
}

export interface PagerData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}
