import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { zip } from 'rxjs/index';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  record: any = {};
  sysUser: any;

  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      username: { type: 'string', title: '用户名称', minLength: 3, maxLength: 30 },
      password: { type: 'string', title: '密码', minLength: 1, maxLength: 30 },
      level: {
        type: 'integer', title: '等级',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      remark: {
        type: 'string', title: '备注', maxLength: 256,
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
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
    },
    required: ['username', 'password', 'level', 'status'],
    ui: {
      grid: {
        span: 24,
      },
    },
  };
  ui: SFUISchema = {};

  constructor(private modal: NzModalRef,
              private msgSrv: NzMessageService,
              public http: _HttpClient,
              private cacheService: CacheService) {
  }

  ngOnInit(): void {

    zip(
      this.http.get(`/chen/admin/sys/user/${this.record.id}`),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_USER.STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_USER.LEVEL',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysUser, statusSelect, levelSelect]: any) => {
      this.schema.properties.status.enum = statusSelect;
      this.schema.properties.level.enum = levelSelect;

      this.sysUser = sysUser;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
