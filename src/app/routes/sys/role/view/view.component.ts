import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-role-view',
  templateUrl: './view.component.html',
})
export class SysRoleViewComponent implements OnInit {
  record: any = {};
  sysRole: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {


    zip(
      this.http.get(`/chen/admin/sys/role/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysRole, statusTag]: any) => {
      sysRole.status = statusTag[sysRole.status];
      this.sysRole = sysRole;
    });
  }

  close() {
    this.modal.destroy();
  }
}
