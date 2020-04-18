import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs/index';

@Component({
  selector: 'app-sys-permission-edit',
  templateUrl: './edit.component.html',
})
export class SysPermissionEditComponent implements OnInit {
  record: any = {};
  sysPermission: any;

  @ViewChild('sf', { static: false }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
      type: {
        type: 'string', title: '类型',
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
    required: ['code', 'name', 'type', 'status'],
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
      this.http.get(`/chen/admin/sys/permission/${this.record.id}`),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_PERMISSION.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysPermission,typeSelect, statusSelect]: any) => {
      this.schema.properties.type.enum = typeSelect;
      this.schema.properties.status.enum = statusSelect;

      this.sysPermission = sysPermission;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/permission/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }


}
