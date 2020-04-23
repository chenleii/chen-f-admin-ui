import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { zip } from 'rxjs/index';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-user-set-role',
  templateUrl: './set-role.component.html',
})
export class SysUserSetRoleComponent implements OnInit {
  record: any = {};
  sysUserRole: any;

  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      sysRoleIdList: {
        type: 'string',
        title: '角色',
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
      this.http.get(`/chen/admin/sys/user/${this.record.id}/sysRole`),
      this.http.get(`/chen/admin/online/loginUser/sysRoleList`),
    ).subscribe(([sysUserRoleList, sysRoleList]: any[]) => {

      const defaultSysUserRoleIdList = sysUserRoleList.map((value, index, array) => {
        return value.id;
      });
      const sysRoleListEnum = sysRoleList.map((value, index, array) => {
        return { title: value.name, value: value.id, disabled: value.status === 'DISABLED' };
      });

      this.schema.properties.sysRoleIdList.enum = sysRoleListEnum;
      this.sysUserRole = { sysRoleIdList: defaultSysUserRoleIdList };

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }
    });
  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/user/${this.record.id}/setSysRole`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
