import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs";

@Component({
  selector: 'app-sys-timed-task-log-view',
  templateUrl: './view.component.html',
})
export class SysTimedTaskLogViewComponent implements OnInit {
  record: any = {};
  sysTimedTaskLog: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {

    zip(
      this.http.get(`/chen/admin/sys/timedTask/log/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_TIMED_TASK.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_TIMED_TASK.EXECUTION_STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysTimedTaskLog, typeTag,  executionStatusTag, statusTag]: any) => {
      sysTimedTaskLog.type = typeTag[sysTimedTaskLog.type];
      sysTimedTaskLog.executionStatus = executionStatusTag[sysTimedTaskLog.executionStatus];
      // sysTimedTaskLog.status = statusTag[sysTimedTaskLog.status];
      this.sysTimedTaskLog = sysTimedTaskLog;
    });
  }


  close() {
    this.modal.destroy();
  }
}
