import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-role-add',
  templateUrl: './add.component.html',
})
export class SysRoleAddComponent implements OnInit {

  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      code: {type: 'string', title: '编码', minLength: 3, maxLength: 50},
      name: {type: 'string', title: '名称', minLength: 3, maxLength: 50},
      remark: {
        type: 'string', title: '备注', maxLength: 256,
        ui: {
          widget: 'textarea',
          autosize: {minRows: 2, maxRows: 6},
        },
      },
      status: {type: 'string', title: '状态',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },},
    },
    required: ['code', 'name', 'status',],
    ui: {
      grid: {
        span: 24
      }
    }
  }
  ui: SFUISchema = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzNotificationService,
    public http: _HttpClient,
    private cacheService: CacheService) {
  }

  ngOnInit(): void {
    zip(
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([statusSelect]: any) => {
      this.schema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });
  }

  save(value: any) {
    this.http.post(`/chen/admin/sys/role`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
