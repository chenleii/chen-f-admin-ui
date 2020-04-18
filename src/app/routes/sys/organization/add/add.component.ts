import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { ArrayService } from '@delon/util';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-organization-add',
  templateUrl: './add.component.html',
})
export class SysOrganizationAddComponent implements OnInit {

  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      parentId: {
        type: 'string', title: '父级',
        enum: [],
        ui: {
          widget: 'tree-select',
          allowClear: true,
        },
      },
      name: { type: 'string', title: '名称' },
      fullName: { type: 'string', title: '全称' },
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
    required: ['name', 'fullName', 'type', 'status'],
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
    public arrayService: ArrayService,
    private cacheService: CacheService) {
  }

  ngOnInit(): void {
    zip(
      this.http.get('/chen/admin/sys/organization/all'),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_ORGANIZATION.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([allSysOrganization, typeSelect, statusSelect]: any) => {

        const sysOrganizationEnum = this.arrayService.arrToTree(allSysOrganization, {
          idMapName: 'id',
          parentIdMapName: 'parentId',
          cb: (item: any) => {
            item.key = item.id;
            item.title = item.name;
          },
        });

        this.arrayService.visitTree(sysOrganizationEnum,
          (item) => {
            item.isLeaf = !item.children || item.children.length === 0;
          },
        );

        this.schema.properties.parentId.enum = sysOrganizationEnum;
        this.schema.properties.type.enum = typeSelect;
        this.schema.properties.status.enum = statusSelect;

        try {
          this.sf.refreshSchema();
        } catch (e) {
          // 如果有缓存就会异常"ERROR Error: Invalid Schema"
        }

      },
    );
  };

  save(value: any) {
    this.http.post(`/chen/admin/sys/organization`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
