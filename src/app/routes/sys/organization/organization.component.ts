import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { SysMenuViewComponent } from '../menu/view/view.component';
import { SysMenuEditComponent } from '../menu/edit/edit.component';
import { CacheService } from '@delon/cache';
import { ArrayService } from '@delon/util';
import { zip } from 'rxjs';
import { SysMenuAddComponent } from '../menu/add/add.component';
import { SysOrganizationAddComponent } from './add/add.component';
import { SysOrganizationViewComponent } from './view/view.component';
import { SysOrganizationEditComponent } from './edit/edit.component';
import { SysOrganizationSetRoleComponent } from './set-role/set-role.component';
import { SysOrganizationSetUserComponent } from './set-user/set-user.component';

@Component({
  selector: 'app-sys-organization',
  templateUrl: './organization.component.html',
})
export class SysOrganizationComponent implements OnInit {

  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      name: {type: 'string', title: '名称'},
      fullName: {type: 'string', title: '全称'},
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
      },
    },
  };
  ui: SFUISchema = {};


  @ViewChild('st', { static: true }) st: STComponent;
  url = `/chen/admin/sys/organization/list`;
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
    process: (data: STData[]) => {
      // 转成树结构
      data = this.arrayService.arrToTree(data, {
        idMapName: 'id',
        parentIdMapName: 'parentId',
      });
      // 遍历设置是否显示展开与是否可以展开
      this.arrayService.visitTree(data,
        (item: any) => {
          if (item.children.length === 0) {
            item.showExpand = false;
            item.expand = false;
          } else {
            item.showExpand = true;
            item.expand = false;
          }
        },
      );

      return data;
    },
  };
  page: STPage = {
    front: false,
    show: false,

    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true,
  };

  columns: STColumn[] = [
    {title: 'ID', index: 'id'},
    {title: '父级ID', index: 'parentId'},
    {title: '名称', index: 'name'},
    {title: '全称', index: 'fullName'},
    {title: '类型', index: 'type', type: 'tag', tag: {}},
    {title: '备注', index: 'remark'},
    {title: '状态', index: 'status', type: 'tag', tag: {}},
    { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysOrganizationViewComponent, { 'record': item }).subscribe();
          },
        },
        {
          text: '编辑', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysOrganizationEditComponent, { 'record': item }).subscribe(res => {
                // 刷新当前页
                this.st.reload();
              },
            );
          },
        },
        {
          text: '设置用户', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysOrganizationSetUserComponent, { 'record': item }).subscribe();
          },
        },
        {
          text: '设置角色', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysOrganizationSetRoleComponent, { 'record': item }).subscribe();
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete('/chen/admin/sys/organization/' + item.id).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        },
      ],
    },
  ];


  constructor(private http: _HttpClient, private modal: ModalHelper,
              private cacheService: CacheService, private arrayService: ArrayService) {
  }

  ngOnInit() {
    zip(
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_ORGANIZATION.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([typeTag, statusTag,]: any[]) => {

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
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/SYS_ORGANIZATION.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([typeSelect, statusSelect,]: any) => {

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
    this.modal.create(SysOrganizationAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });
  }

}
