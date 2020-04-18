import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';

import { SysUserViewComponent } from './view/view.component';
import { SysUserEditComponent } from './edit/edit.component';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs/index';
import { SysUserAddComponent } from './add/add.component';
import { SysUserSetRoleComponent } from './set-role/set-role.component';

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
})
export class SysUserComponent implements OnInit {

  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      username: { type: 'string', title: '用户名称' },
      level: {
        type: 'integer', title: '等级',
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
  url = `/chen/admin/sys/user`;
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
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true,
  };
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '用户名称', index: 'username' },
    { title: '级别', index: 'level', type: 'tag', tag: {} },
    { title: '最后登录时间', index: 'lastLoginDateTime', type: 'date', default: '未登录过' },
    { title: '描述', index: 'remark', width: '200px' },
    { title: '状态', index: 'status', type: 'tag', tag: {} },
    { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          // text: '查看', type: 'modal',
          // modal: {component: SysUserViewComponent, params: (record: STData) => record, paramsName: 'record'},
          // click: null,
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysUserViewComponent, { 'record': item }).subscribe();
          },
        },
        {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysUserEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/user/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        }, {
          text: '设置角色', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysUserSetRoleComponent, { 'record': item }).subscribe();
          },
        },
      ],
    },
  ];


  constructor(private http: _HttpClient, private modal: ModalHelper, private cacheService: CacheService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_USER.LEVEL',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_USER.STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([levelTag, statusTag]: any[]) => {

      this.columns.forEach((value) => {
        if (value.index === 'level') {
          value.tag = levelTag;
        }
        if (value.index === 'status') {
          value.tag = statusTag;
        }
      });

      this.st.resetColumns({ columns: this.columns }).then();

    });

    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_USER.LEVEL',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_USER.STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([levelSelect, statusSelect]: any) => {

      this.searchSchema.properties.level.enum = levelSelect;
      this.searchSchema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  add() {
    this.modal.create(SysUserAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });


  }


}
