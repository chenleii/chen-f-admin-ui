import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-user-view',
  templateUrl: './view.component.html',
})
export class SysUserViewComponent implements OnInit {
  record: any = {};
  sysUser: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {

    zip(
      this.http.get(`/chen/admin/sys/user/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_USER.STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_USER.LEVEL",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysUser, sysUserStatusTag, sysUserLevelTag]: any) => {
      sysUser.status = sysUserStatusTag[sysUser.status];
      sysUser.level = sysUserLevelTag[sysUser.level];
      this.sysUser = sysUser;
    });
  }

  close() {
    this.modal.destroy();
  }
}
