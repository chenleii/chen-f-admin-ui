import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-role-set-api',
  templateUrl: './set-api.component.html',
})
export class SysRoleSetApiComponent implements OnInit {
  record: any = {};
  sysRoleApi: any;

  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      sysApiIdList: {
        type: 'string',
        title: '接口',
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
      this.http.get(`/chen/admin/online/sysApiList`),
      this.http.get(`/chen/admin/sys/api/role/enabled/${this.record.id}`),
    ).subscribe(([onlineSysUserApiList, sysRoleApiList]: any[]) => {

      const defaultSysApiIdList = sysRoleApiList.map((value, index, array) => {
        return value.id;
      });
      const sysApiListEnum = onlineSysUserApiList.map((value, index, array) => {
        return { title: value.name, value: value.id, disabled: value.status === 'DISABLED' };
      });

      this.sysRoleApi = { sysApiIdList: defaultSysApiIdList };
      this.schema.properties.sysApiIdList.enum = sysApiListEnum;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });
  }


  save(value: any) {
    this.http.put(`/chen/admin/sys/role/${this.record.id}/setSysApi`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
