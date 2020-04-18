import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-permission-view',
  templateUrl: './view.component.html',
})
export class SysPermissionViewComponent implements OnInit {
  record: any = {};
  sysPermission: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/permission/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_PERMISSION.TYPE", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysPermission, statusTag,sysPermissionTypeTag]: any) => {
      sysPermission.type = sysPermissionTypeTag[sysPermission.type];
      sysPermission.status = statusTag[sysPermission.status];
      this.sysPermission = sysPermission;
    });
  }

  close() {
    this.modal.destroy();
  }
}
