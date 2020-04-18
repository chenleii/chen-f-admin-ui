import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-organization-set-user',
  templateUrl: './set-user.component.html',
})
export class SysOrganizationSetUserComponent implements OnInit {
  record: any = {};
  sysOrganizationUser: any;

  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      sysUserIdList: {
        type: 'string',
        title: '用户',
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
      this.http.get(`/chen/admin/sys/organization/${this.record.id}/sysUser`),
      this.http.get(`/chen/admin/sys/user/all`),
    ).subscribe(([sysOrganizationUserList, allSysUser]: any[]) => {

      const defaultSysOrganizationUserIdList = sysOrganizationUserList.map((value, index, array) => {
        return value.id;
      });
      const sysUserListEnum = allSysUser.map((value, index, array) => {
        return { title: value.username, value: value.id, disabled: value.status === 'DISABLED' };
      });

      this.schema.properties.sysUserIdList.enum = sysUserListEnum;
      this.sysOrganizationUser = { sysUserIdList: defaultSysOrganizationUserIdList };

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });
  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/organization/${this.record.id}/setSysUser`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
