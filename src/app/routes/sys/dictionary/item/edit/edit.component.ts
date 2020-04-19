import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-dictionary-item-edit',
  templateUrl: './edit.component.html',
})
export class SysDictionaryItemEditComponent implements OnInit {
  record: any = {};
  sysDictionary: any;
  sysDictionaryItem: any;

  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码', readOnly: true },
      name: { type: 'string', title: '名称', readOnly: true },
      key: { type: 'string', title: 'KEY' },
      value: { type: 'string', title: '值' },
      valueI18n: { type: 'string', title: '值的国际化' },
      keyType: {
        type: 'string', title: 'KEY类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      valueType: {
        type: 'string', title: '值类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
      color: { type: 'string', title: '颜色', format: 'color' },
      order: { type: 'integer', title: '顺序' },
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
    required: ['code', 'name', 'key', 'value', 'keyType', 'valueType', 'status'],
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
      this.http.get(`/chen/admin/sys/dictionary/item/${this.record.id}`),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/VALUE_TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysDictionaryItem, typeSelect, statusSelect]: any) => {
        this.schema.properties.keyType.enum = typeSelect;
        this.schema.properties.valueType.enum = typeSelect;
        this.schema.properties.status.enum = statusSelect;

        this.sysDictionaryItem = sysDictionaryItem;

        try {
          this.sf.refreshSchema();
        } catch (e) {
          // 如果有缓存就会异常"ERROR Error: Invalid Schema"
        }

      },
    );
  };

  save(value: any) {
    this.http.put(`/chen/admin/sys/dictionary/item/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
