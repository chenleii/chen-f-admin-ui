import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-organization-view',
  templateUrl: './view.component.html',
})
export class SysOrganizationViewComponent implements OnInit {
  record: any = {};
  sysOrganization: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public cacheService: CacheService,
  ) { }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/organization/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_ORGANIZATION.TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysOrganization,typeTag, statusTag,]: any[]) => {

      sysOrganization.type = typeTag[sysOrganization.type];
      sysOrganization.status = statusTag[sysOrganization.status];
      this.sysOrganization = sysOrganization;
    });
  }

  close() {
    this.modal.destroy();
  }
}
