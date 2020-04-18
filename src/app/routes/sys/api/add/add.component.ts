import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { zip } from 'rxjs/index';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-api-add',
  templateUrl: './add.component.html',
})
export class SysApiAddComponent implements OnInit {
  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      url: { type: 'string', title: '路径' },
      httpMethod: {
        type: 'string', title: 'HTTP请求方法',
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
      remark: { type: 'string', title: '备注', maxLength: 256 },
      status: {
        type: 'string', title: '状态',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
    },
    required: ['name', 'httpMethod', 'type', 'status'],
    ui: {
      grid: {
        span: 24,
      },
    },
  };
  ui: SFUISchema = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzNotificationService,
    public http: _HttpClient,
    private cacheService: CacheService) {
  }

  ngOnInit(): void {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_API.HTTP_METHOD',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_API.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([httpMethodSelect, typeSelect, statusSelect]: any[]) => {
      this.schema.properties.httpMethod.enum = httpMethodSelect;
      this.schema.properties.type.enum = typeSelect;
      this.schema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });
  }

  save(value: any) {
    this.http.post(`/chen/admin/sys/api`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
