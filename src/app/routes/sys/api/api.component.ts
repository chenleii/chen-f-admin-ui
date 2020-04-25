import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs/index';
import { SysApiViewComponent } from './view/view.component';
import { SysApiEditComponent } from './edit/edit.component';
import { SysApiAddComponent } from './add/add.component';
import { STRequestOptions } from '@delon/abc/table/table.interfaces';

@Component({
  selector: 'app-sys-api',
  templateUrl: './api.component.html',
})
export class SysApiComponent implements OnInit {
  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      url: { type: 'string', title: '路径' },
      httpMethod: {
        type: 'string', title: '请求方法',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      type: {
        type: 'string', title: '类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      status: {
        type: 'string', title: '状态',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      remark: {
        type: 'string', title: '备注',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
    },
    ui: {
      // spanLabel: 10,
      // spanControl: 14,
      grid: {
        span: 6,
      },
    },
  };
  ui: SFUISchema = {};


  @ViewChild('st', { static: true }) st: STComponent;
  url = `/chen/admin/sys/api`;
  req: STReq = {
    params: this.params,
    reName: {
      pi: 'pageIndex',
      ps: 'pageSize',
    },
  };
  res: STRes = {
    reName: {
      total: 'total',
      list: 'list',
    },
  };
  page: STPage = {
    front: false,
    show: true,

    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true,
  };
  columns: STColumn[] = [
    { title: 'ID', index: 'id', sort: true },
    { title: '名称', index: 'name', sort: true },
    { title: '路径', index: 'url', sort: true },
    { title: 'HTTP请求方法', index: 'httpMethod', type: 'tag', tag: {} },
    { title: '类型', index: 'type', type: 'tag', tag: {} },
    { title: '备注', index: 'remark' },
    { title: '状态', index: 'status', type: 'tag', tag: {} },
    // { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    // { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysApiViewComponent, { 'record': item }).subscribe();
          },
        }, {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysApiEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/api/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        },
      ],
    },
  ];


  constructor(private http: _HttpClient, private modal: ModalHelper, private cacheService: CacheService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_API.HTTP_METHOD',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_API.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([httpMethodTag, typeTag, statusTag]: any[]) => {

      this.columns.forEach((value) => {
        if (value.index === 'httpMethod') {
          value.tag = httpMethodTag;
        }
        if (value.index === 'type') {
          value.tag = typeTag;
        }
        if (value.index === 'status') {
          value.tag = statusTag;
        }
      });

      this.st.resetColumns({ columns: this.columns }).then();

    });

    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_API.HTTP_METHOD',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_API.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([httpMethodSelect, typeSelect, statusSelect]: any[]) => {

      this.searchSchema.properties.httpMethod.enum = httpMethodSelect;
      this.searchSchema.properties.type.enum = typeSelect;
      this.searchSchema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  add() {
    this.modal.create(SysApiAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });
  }
}
