import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs/index';

@Component({
  selector: 'app-sys-role-set-permission',
  templateUrl: './set-permission.component.html',
})
export class SysRoleSetPermissionComponent implements OnInit {
  record: any = {};
  sysRolePermission: any;

  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      sysPermissionIdList: {
        type: 'string',
        title: '权限',
        enum: [],
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
          showSearch: true,
          // listStyle:{ 'width.px': 300, 'height.px': 300 }
        },
        default: [],
      },
    },
    required: [],
  };
  ui: SFUISchema = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private cacheService: CacheService,
  ) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/role/permission/${this.record.id}`),
      this.http.get(`/chen/admin/online/sysUser`),
    ).subscribe(([sysRolePermissionList, onlineSysUser]: any[]) => {

      const defaultSysRolePermissionIdList = sysRolePermissionList.map((value, index, array) => {
        return value.id;
      });
      const sysPermissionListEnum = onlineSysUser.sysUserPermissionList.map((value, index, array) => {
        return { title: value.name, value: value.id, disabled: value.status === 'DISABLED' };
      });

      this.sysRolePermission = { sysPermissionIdList: defaultSysRolePermissionIdList };
      this.schema.properties.sysPermissionIdList.enum = sysPermissionListEnum;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });
  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/role/${this.record.id}/setSysPermission`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
