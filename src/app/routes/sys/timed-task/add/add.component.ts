import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-timed-task-add',
  templateUrl: './add.component.html',
})
export class SysTimedTaskAddComponent implements OnInit {
  @ViewChild('sf', { static: true })  sf: SFComponent;
  schema: SFSchema = {
    properties: {
      code: {type: 'string', title: '编码', minLength: 1, maxLength: 100},
      name: {type: 'string', title: '名称', minLength: 1, maxLength: 100},
      className: {type: 'string', title: '类名', minLength: 1, maxLength: 255},
      cronExpression: {type: 'string', title: 'CORN表达式', maxLength: 30},
      data: {type: 'string', title: '数据(JSON格式)',},
      type: {type: 'string', title: '类型',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },},
      remark: {type: 'string', title: '备注',},
      status: {type: 'string', title: '状态',
        enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        },},
    },
    required: ['code', 'name', 'className', 'cronExpression', 'type', 'status',],
    ui: {
      // spanLabel: 10,
      // spanControl: 14,
      grid: {
        span: 24,
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
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/SYS_TIMED_TASK.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/select/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([typeSelect, statusSelect]: any[]) => {
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
    this.http.post(`/chen/admin/sys/timedTask`, value).subscribe(res => {
      this.msgSrv.success('提示', '保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
