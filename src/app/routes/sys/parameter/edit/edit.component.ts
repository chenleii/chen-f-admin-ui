import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-parameter-edit',
  templateUrl: './edit.component.html',
})
export class SysParameterEditComponent implements OnInit {
  record: any = {};
  sysParameter: any;

  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
      value: { type: 'string', title: '值' },
      valueType: {
        type: 'string', title: '值类型',
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
    required: ['code', 'name', 'value', 'valueType', 'type', 'status'],
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
      this.http.get(`/chen/admin/sys/parameter/${this.record.id}`),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/VALUE_TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_PARAMETER.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysParameter, valueTypeSelect, typeSelect, statusSelect]: any) => {
        this.schema.properties.valueType.enum = valueTypeSelect;
        this.schema.properties.type.enum = typeSelect;
        this.schema.properties.status.enum = statusSelect;

        this.sysParameter = sysParameter;

        try {
          this.sf.refreshSchema();
        } catch (e) {
          // 如果有缓存就会异常"ERROR Error: Invalid Schema"
        }

      },
    );
  };

  save(value: any) {
    this.http.put(`/chen/admin/sys/parameter/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
