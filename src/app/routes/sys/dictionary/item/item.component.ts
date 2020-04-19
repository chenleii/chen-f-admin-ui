import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { ArrayService } from '@delon/util';
import { Router } from '@angular/router';
import { zip } from 'rxjs';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SysDictionaryItemAddComponent } from './add/add.component';
import { SysDictionaryItemEditComponent } from './edit/edit.component';
import { SysDictionaryItemViewComponent } from './view/view.component';

@Component({
  selector: 'app-sys-dictionary-item',
  templateUrl: './item.component.html',
})
export class SysDictionaryItemComponent implements OnInit {
  record: any = {};

  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = { 'sysDictionaryId': this.record.id };
  searchSchema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
      key: { type: 'string', title: 'KEY' },
      value: { type: 'string', title: '值' },
      keyType: {
        type: 'string', title: 'KEY类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      valueType: {
        type: 'string', title: '值类型',
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

  url = `/chen/admin/sys/dictionary/item`;
  req: STReq = {
    params: this.params,
    reName: {
      pi: 'pageIndex',
      ps: 'pageNumber',
    },
  };
  res: STRes = {
    reName: {
      total: 'total',
      list: 'records',
    },
  };
  page: STPage = {
    front: false,
    show: true,

    showSize: true,
    pageSizes: [5, 10, 20],
    showQuickJumper: true,
    total: true,
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '编码', index: 'code' },
    { title: '名称', index: 'name' },
    { title: 'KEY', index: 'key' },
    { title: '值', index: 'value' },
    { title: '值的国际化', index: 'valueI18n' },
    { title: 'KEY类型', index: 'keyType', type: 'tag', tag: {} },
    { title: '值类型', index: 'valueType', type: 'tag', tag: {} },
    { title: '备注', index: 'remark' },
    { title: '状态', index: 'status', type: 'tag', tag: {} },
    { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysDictionaryItemViewComponent, { 'record': item }).subscribe();

          },
        },
        {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysDictionaryItemEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/dictionary/item/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient,
              private modalRef: NzModalRef,
              public msgSrv: NzMessageService, private modal: ModalHelper,
              private cacheService: CacheService,
              private arrayService: ArrayService,
              private router: Router) {
  }

  ngOnInit() {
    this.params.sysDictionaryId = this.record.id;

    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/VALUE_TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeTag, statusTag]: any[]) => {
      this.columns.forEach((value) => {
        if (value.index === 'keyType') {
          value.tag = typeTag;
        }
        if (value.index === 'valueType') {
          value.tag = typeTag;
        }
        if (value.index === 'status') {
          value.tag = statusTag;
        }
      });

      this.st.resetColumns({ columns: this.columns }).then();
    });


    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/VALUE_TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeSelect, statusSelect]: any) => {

      this.searchSchema.properties.keyType.enum = typeSelect;
      this.searchSchema.properties.valueType.enum = typeSelect;
      this.searchSchema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  add() {
    this.modal.createStatic(SysDictionaryItemAddComponent, { sysDictionary: this.record })
      .subscribe(() => this.st.reload());
  }

  close() {
    this.modalRef.destroy();
  }

}
