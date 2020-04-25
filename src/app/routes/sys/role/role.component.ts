import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs/index';
import { SysRoleViewComponent } from './view/view.component';
import { SysRoleEditComponent } from './edit/edit.component';
import { SysRoleAddComponent } from './add/add.component';
import { SysRoleSetPermissionComponent } from './set-permission/set-permission.component';
import { ArrayService } from '@delon/util';
import { SysRoleSetMenuComponent } from './set-menu/set-menu.component';
import { SysRoleSetApiComponent } from './set-api/set-api.component';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {
  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
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
  url = `/chen/admin/sys/role`;
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
    { title: '编码', index: 'code', sort: true },
    { title: '名称', index: 'name', sort: true },
    { title: '描述', index: 'remark' },
    { title: '状态', index: 'status', type: 'tag', tag: {} },
    // { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    // { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysRoleViewComponent, { 'record': item }).subscribe();
          },
        },
        {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysRoleEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/role/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        }, {
          text: '设置权限', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysRoleSetPermissionComponent, { 'record': item }).subscribe();
          },
        }, {
          text: '设置菜单', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysRoleSetMenuComponent, { 'record': item }).subscribe();
          },
        }, {
          text: '设置接口', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysRoleSetApiComponent, { 'record': item }).subscribe();
          },
        },
      ],
    },
  ];


  constructor(private http: _HttpClient,
              private modal: ModalHelper,
              private cacheService: CacheService,
              private arrayService: ArrayService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([statusTag]: any) => {

      this.columns.forEach((value) => {
        if (value.index === 'status') {
          value.tag = statusTag;
        }
      });

      this.st.resetColumns({ columns: this.columns }).then();
    });

    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([statusSelect]: any) => {

      this.searchSchema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  add() {
    this.modal.create(SysRoleAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });
  }

}
