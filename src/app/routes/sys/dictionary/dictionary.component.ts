import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { zip } from 'rxjs';
import { CacheService } from '@delon/cache';
import { ArrayService } from '@delon/util';
import { SysDictionaryViewComponent } from './view/view.component';
import { SysDictionaryEditComponent } from './edit/edit.component';
import { SysDictionaryAddComponent } from './add/add.component';
import { Router } from '@angular/router';
import { SysDictionaryItemComponent } from './item/item.component';

@Component({
  selector: 'app-sys-dictionary',
  templateUrl: './dictionary.component.html',
})
export class SysDictionaryComponent implements OnInit {
  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
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

  url = `/chen/admin/sys/dictionary`;
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
    placement: 'right',

    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true,
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id', sort: true },
    { title: '编码', index: 'code', sort: true },
    { title: '名称', index: 'name', sort: true },
    { title: '类型', index: 'type', type: 'tag', tag: {} },
    { title: '备注', index: 'remark' },
    { title: '状态', index: 'status', type: 'tag', tag: {} },
    // { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    // { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '具体项目', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysDictionaryItemComponent, { 'record': item }, { 'size': 'xl' }).subscribe();
          },
        }, {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysDictionaryViewComponent, { 'record': item }).subscribe();

          },
        }, {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysDictionaryEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/dictionary/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,
              private cacheService: CacheService,
              private arrayService: ArrayService,
              private router: Router) {
  }

  ngOnInit() {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_DICTIONARY.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeTag, statusTag]: any[]) => {
      this.columns.forEach((value) => {
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
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_DICTIONARY.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeSelect, statusSelect]: any) => {

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
    this.modal.createStatic(SysDictionaryAddComponent, { i: { id: 0 } })
      .subscribe(() => this.st.reload());
  }

}
