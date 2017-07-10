import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { DataService } from '../../_services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData, EventData, PagerData } from '../../_models/data.model';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'underscore';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
  providers:[DataService]
})
export class DatatableComponent implements OnInit, OnDestroy {

  @Input() tableData: TableData;
  @Output() callProcedure = new EventEmitter<EventData>();

  public tableSubscription: Subscription;
  public queryParams: any;
  public pagerData: PagerData;

  public filterString: string;

  public settingPopover: boolean;
  public selectedAction: boolean;
  public selectedIds: string[];

  constructor(private dataService: DataService,  private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.tableData)
    this.tableSubscription = new Subscription();
    this.selectedIds = [];
    this.queryParams = {};
    this.filterString = '';
    this.settingPopover = false;
    this.selectedAction = false;
    this.pagerData = { currentPage: 0, pageSize: 0, totalPages: 0, startPage: 0, endPage: 0, startIndex: 0, endIndex: 0, pages: [] };
    this.subscribeParams();
  }

  subscribeParams() {
    this.tableSubscription.add(
  this.route
  .queryParams
  .subscribe(params => {
    this.queryParams = Object.assign({}, params);
    if (this.queryParams['currentPage'] === undefined) {
      this.queryParams['currentPage'] = 1;
    }
    if (this.queryParams['pageSize'] === undefined) {
      this.queryParams['pageSize'] = 10;
    }
    this.subscribeData();
  })
);
  }

  subscribeData() {
    this.tableSubscription.add(
      this
      .dataService
      .fetchTableData(this.tableData.links.api.fetchData, this.queryParams)
      .subscribe(responseData => {
        if (responseData.success) {
          this.tableData.data = Object.assign({}, responseData).data;
          if (sessionStorage.getItem('selectedIds') !== null) {
            this.selectedIds = JSON.parse(sessionStorage.getItem('selectedIds'));
          }
          this.setPagerData(responseData.meta.count, parseInt(this.queryParams['currentPage'], 10), responseData.meta.pageSize);
        } else {
          alert('Error! There was problem in fetching data.');
        }
      })
    );
  }

  closeSidebar() {
    this.callProcedure.emit({
      selectedProcedure: 'CloseSidebar'
    });
  }

  openSidebar() {
    this.callProcedure.emit({
      selectedProcedure: 'OpenSidebar'
    });
  }

  tooglePopover() {
    if (this.settingPopover) {
      this.settingPopover = false;
    } else {
      this.settingPopover = true;
    }
  }

  allChecked() {
    this.tableData.data.forEach((item) => {
      if (this.selectedIds.indexOf(item._id) === -1) {
        return false;
      }
    });
    return true;
  }

  checkAll(event) {
    this.tableData.data.forEach((item) => {
      if (event.target.checked) {
        this.selectedIds.push(item._id);
      } else {
        this.selectedIds.splice(this.selectedIds.indexOf(item._id), 1);
      }
    });
  }

  uncheckAll() {
    this.selectedIds = [];
  }

  isChecked(id: string) {
    if (this.selectedIds.indexOf(id) > -1) {
      return true;
    } else {
      return false;
    }
  }

  checkItem(id: string, event) {
    if (event.target.checked) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
    }
  }

  getItemValue(item: any, id: string) {
    const path = id.split('.');
    let object = item;
    while (path.length !== 1) {
      if (_.isEmpty(object)) {
        return undefined;
      }
      object = object[path.shift()];
    }
    return object[path.shift()];
  }

  setFilter(id: string, name: string) {
    this.tableData.filter.filterBy.id = id;
    this.tableData.filter.filterBy.name = name;
  }

  fillFilter(item: any, id: string) {
    this.tableData.filter.filters.forEach((filter) => {
      if (filter.id === id) {
        this.tableData.filter.filterBy = filter;
      }
    });
    this.tableData.columns.forEach((column) => {
      if (column.id === id) {
        this.filterString = this.getItemValue(item, column.keyPath);
      }
    });
    this.filterQuery();
  }

  clearFilter() {
    this.filterString = '';
    this.filterQuery();
  }

  filterQuery() {
    if (this.filterString.length !== 0) {
      this.queryParams[this.tableData.filter.filterBy.id] = this.filterString;
      this.setPage(this.pagerData.currentPage);
    } else {
      this.tableData.filter.filters.forEach((filter) => {
        delete this.queryParams[filter.id];
      });
      this.setPage(this.pagerData.currentPage);
    }
  }

  sortData(id: string, name: string) {
    const sortBy = this.tableData.sort.sortBy;
    sortBy.id = id;
    sortBy.name = name;
    if (sortBy.order === 0) {
      sortBy.order = 1;
      this.queryParams['sortBy'] = sortBy.id;
      this.queryParams['order'] = sortBy.order;
      this.setPage(this.pagerData.currentPage);
    } else if (sortBy.order === 1) {
      sortBy.order = -1;
      this.queryParams['sortBy'] = sortBy.id;
      this.queryParams['order'] = sortBy.order;
      this.setPage(this.pagerData.currentPage);
    } else if (sortBy.order === -1) {
      sortBy.order = 0;
      delete this.queryParams['sortBy'];
      delete this.queryParams['order'];
      this.setPage(this.pagerData.currentPage);
    }
  }

  sendToParent(item: any, procedure: string) {
    this.callProcedure.emit({
      selectedItem: item,
      selectedIds: this.selectedIds,
      selectedProcedure: procedure,
      queryParams: this.queryParams
    });
  }

  emitToParent(procedure: string) {
    if (procedure === 'BatchExport') {
      this.selectedAction = true;
      this.executeDatatableAction('DownloadCSV');
    } else if (procedure === 'BatchPrint') {
      this.selectedAction = true;
      this.executeDatatableAction('PrintTable');
    } else {
      this.callProcedure.emit({
        selectedIds: this.selectedIds,
        selectedProcedure: procedure,
        queryParams: this.queryParams
      });
    }
  }

  getJsonData(arrData: any[]) {
    let jsonString = '[', lastColumn = '', colDate = '';
    this.tableData.columns.forEach((t) => {
      if (t.active) {
        lastColumn = t.id;
      }
    });
    arrData.forEach((t, n) => {
      jsonString += `{  "#": "${n + 1}",`;
      this.tableData.columns.forEach((k, m) => {
        if (k.active) {
          if (k.iconId) {
            this.tableData.icons.forEach((c) => {
              if (c.id === k.iconId) {
                jsonString += ` "${k.name}":  "#icon:${c.className}"`;
              }
            });
          } else if (this.getItemValue(t, k.keyPath)) {
            if (k.dateFilter) {
              colDate = new DatePipe(this.getItemValue(t, k.keyPath)).transform(this.getItemValue(t, k.keyPath), 'dd-MM-yyyy');
              jsonString += ` "${k.name}":  "${colDate}"`;
            } else {
              jsonString += ` "${k.name}":  "${this.getItemValue(t, k.keyPath)}"`;
            }
          } else {
            jsonString += ` "${k.name}":  ""`;
          }
          if (k.id !== lastColumn) {
            jsonString += ',';
          }
        }
      });
      jsonString += '}';
      if (n + 1 !== arrData.length) {
        jsonString += ',';
      }
    });
    jsonString += ']';
    return JSON.parse(jsonString);
  }

 executeDatatableAction(procedure: string) {
    const maxRowCount = 500;
    let arrData = [], jsonData = [], rowCountError = false, popupWin;
    if (procedure === 'PrintTable') {
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    }
    this
      .dataService
      .fetchTableData(this.tableData.links.api.fetchData, { pageSize: maxRowCount})
      .subscribe(response => {
        if (response.meta.count > maxRowCount) {
          rowCountError = true;
        }
        if (this.selectedAction) {
          response.data.forEach((t) => {
            if (this.selectedIds.indexOf(t._id) > -1) {
              arrData.push(t);
            }
          });
          this.selectedAction = false;
        } else {
          arrData = response.data;
        }
        jsonData = this.getJsonData(arrData);
        if (procedure === 'DownloadCSV') {
          this.downloadCSV(jsonData, rowCountError);
        } else if (procedure === 'PrintTable') {
          this.printTable(jsonData, popupWin, rowCountError);
        }
      });
  }

  downloadCSV(arrData: any[], rowCountError: boolean) {
    let confirmMessage = '';
    if (rowCountError) {
      confirmMessage = 'Maximum row limit reached!\n' +
        'Please make use filters to reduce row count.\n' +
        'Do you still want to continue? (Contnuing will remove all the excess rows.)';
      if (confirm(confirmMessage) === false) {
        return;
      }
    }
    const csvData = this.ConvertToCSV(arrData);
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([csvData], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'TableExport.csv';
    a.click();
  }

  ConvertToCSV(arrData: any[]) {
    let CSV = '', row = '', i = 0;
    for (const index in arrData[0]) {
      if (arrData[0].hasOwnProperty(index)) {
        row += index + ',';
      }
    }
    row = row.slice(0, -1);
    CSV += row + '\r\n';
    for (i = 0; i < arrData.length; i++) {
      row = '';
      for (const index in arrData[i]) {
        if (arrData[i].hasOwnProperty(index)) {
          row += '"' + arrData[i][index] + '",';
        }
      }
      row.slice(0, row.length - 1);
      CSV += row + '\r\n';
    }
    if (CSV === '') {
      alert('Invalid data');
      return;
    }
    return CSV;
  }

  printTable(arrData: any[], popupWin: any, rowCountError: boolean) {
    const maxColCount = 5;
    let colCount = 0, confirmMessage = '';
    this.tableData.columns.forEach((t) => {
      if (t.active) {
        colCount = colCount + 1;
      }
    });
    if (colCount > maxColCount) {
      confirmMessage = 'Maximum column limit reached!\n' +
        'Please make some columns inactive to reduce column count.\n' +
        'Do you still want to continue? (Contnuing will consider all the columns.)';
      if (popupWin.confirm(confirmMessage) === false) {
        popupWin.close();
        return;
      }
    }
    if (rowCountError) {
      confirmMessage = 'Maximum row limit reached!\n' +
        'Please make use filters to reduce row count.\n' +
        'Do you still want to continue? (Contnuing will remove all the excess rows.)';
      if (popupWin.confirm(confirmMessage) === false) {
        popupWin.close();
        return;
      }
    }
    const keyData = Object.keys(arrData[0]);
    let printContents = '<table class="table table-bordered"><thead><tr>';
    keyData.forEach((key) => {
      printContents += `<th>${key}</th>`;
    });
    printContents += '</thead></tr><tbody>';
    arrData.forEach((item) => {
      printContents += '<tr>';
      keyData.forEach((key) => {
        if (item[key].search('#icon') > -1) {
           printContents += `<td class="text-center"><span class="${item[key].split(':')[1]}" aria-hidden="true"></span></td>`;
        } else {
           printContents += `<td>${item[key]}</td>`;
        }
      });
      printContents += '</tr>';
    });
    printContents += '</tbody></table';
    popupWin.document.open();
    popupWin.document.write(`
          <html>
              <head>
                  <title>Datatable</title>
                  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
              </head>
              <style>
                  table, th, td {
                    border: 1px solid black;
                  }
              </style>
              <body onload="window.print();window.close()">${printContents}</body>
          </html>`);
    popupWin.document.close();
  }

  setPageSize() {
    this.queryParams['pageSize'] = this.tableData.rows;
    this.setPage(1);
  }

  setPage(page: number) {
    if (page < 1 && page > this.pagerData.totalPages) {
      alert('Invalid page number!');
      console.log('Invalid page number!');
    } else {
      this.queryParams['currentPage'] = page;
      sessionStorage.setItem('selectedIds', JSON.stringify(this.selectedIds));
      this.router.navigate([this.tableData.links.navigation.mainPage], {
          queryParams: this.queryParams
      });
    }
  }

  setPagerData(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const pages = _.range(startPage, endPage + 1);

    this.pagerData.currentPage = currentPage;
    this.pagerData.pageSize = pageSize;
    this.pagerData.totalPages = totalPages;
    this.pagerData.startPage = startPage;
    this.pagerData.endPage = endPage;
    this.pagerData.startIndex = startIndex;
    this.pagerData.endIndex = endIndex;
    this.pagerData.pages = pages;
  }

  handleImageError(event) {
    event.target.src = 'assets/img/default-image.png';
  }

  ngOnDestroy(): void {
    this.tableSubscription.unsubscribe();
  }
}
