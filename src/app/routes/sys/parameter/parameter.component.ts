import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';
import { SysParameterAddComponent } from './add/add.component';
import { SysParameterViewComponent } from './view/view.component';
import { SysParameterEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-sys-parameter',
  templateUrl: './parameter.component.html',
})
export class SysParameterComponent implements OnInit {
  @ViewChild('sf', { static: true })  sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      code: {type: 'string', title: '编码'},
      name: {type: 'string', title: '名称'},
      value: {type: 'string', title: "值",},
      valueType: {
        type: 'string', title: '值类型',
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
          autosize: {minRows: 2, maxRows: 6}
        }
      },
    },
    ui: {
      // spanLabel: 10,
      // spanControl: 14,
      grid: {
        span: 6,
      }
    }
  };
  ui: SFUISchema = {};

  @ViewChild('st', { static: true })  st: STComponent;
  url = `/chen/admin/sys/parameter`;
  req: STReq = {
    params: this.params,
    reName: {
      pi: 'pageIndex',
      ps: 'pageNumber'
    }
  };
  res: STRes = {
    reName: {
      total: 'total',
      list: 'records'
    }
  };
  page: STPage = {
    front: false,
    show: true,
    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true
  };
  columns: STColumn[] = [
    {title: 'ID', index: 'id'},
    {title: '编码', index: 'code'},
    {title: '名称', index: 'name'},
    {title: '值', index: 'value',},
    {title: '值类型', index: 'valueType', type: 'tag', tag: {}},
    {title: '类型', index: 'type', type: 'tag', tag: {}},
    {title: '描述', index: 'remark',},
    {title: '状态', index: 'status', type: 'tag', tag: {}},
    {title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: "未修改过"},
    {title: '创建的日期时间', index: 'createdDateTime', type: 'date'},
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysParameterViewComponent, {'record': item}).subscribe();
          }
        },
        {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysParameterEditComponent, {'record': item}).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              }
            );
          }
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/parameter/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            })
          }
        }
      ]
    }
  ];


  constructor(private http: _HttpClient, private modal: ModalHelper, private cacheService: CacheService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/VALUE_TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_PARAMETER.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([valueTypeTag, typeTag, statusTag,]: any[]) => {

      this.columns.forEach((value) => {
        if (value.index === 'valueType') {
          value.tag = valueTypeTag;
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
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/VALUE_TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/SYS_PARAMETER.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([valueTypeSelect, typeSelect, statusSelect]: any) => {

      this.searchSchema.properties.valueType.enum = valueTypeSelect;
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
    this.modal
      .createStatic(SysParameterAddComponent, {i: {id: 0}})
      .subscribe(() => this.st.reload());
  }

}
