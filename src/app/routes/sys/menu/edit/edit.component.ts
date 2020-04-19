import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { ArrayService } from '@delon/util';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';

@Component({
  selector: 'app-sys-menu-edit',
  templateUrl: './edit.component.html',
})
export class SysMenuEditComponent implements OnInit {
  record: any = {};
  sysMenu: any;

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
      nameI18n: { type: 'string', title: '名称的国际化' },
      url: { type: 'string', title: 'URL' },
      icon: { type: 'string', title: '图标' },
      type: {
        type: 'string', title: '类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },
      },
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
    required: ['name', 'type', 'status'],
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
      this.http.get(`/chen/admin/sys/menu/${this.record.id}`),
      this.http.get('/chen/admin/sys/menu/all'),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_MENU.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysMenu, allSysMenu, typeSelect, statusSelect]: any) => {

        const sysMenuTreeEnum = this.arrayService.arrToTree(allSysMenu, {
          idMapName: 'id',
          parentIdMapName: 'parentId',
          cb: (item: any) => {
            item.key = item.id;
            item.title = item.name;
          },
        });

        this.arrayService.visitTree(sysMenuTreeEnum,
          (item) => {
            item.isLeaf = !item.children || item.children.length === 0;
          },
        );

        this.schema.properties.parentId.enum = sysMenuTreeEnum;
        this.schema.properties.type.enum = typeSelect;
        this.schema.properties.status.enum = statusSelect;

        this.sysMenu = sysMenu;

        try {
          this.sf.refreshSchema();
        } catch (e) {
          // 如果有缓存就会异常"ERROR Error: Invalid Schema"
        }

      },
    );
  };

  save(value: any) {
    this.http.put(`/chen/admin/sys/menu/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }


  close() {
    this.modal.destroy();
  }
}
