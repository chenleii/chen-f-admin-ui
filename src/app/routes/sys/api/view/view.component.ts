import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-api-view',
  templateUrl: './view.component.html',
})
export class SysApiViewComponent implements OnInit {
  record: any = {};
  sysApi: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/api/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_API.HTTP_METHOD", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_API.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysApi,httpMethodTag, typeTag, statusTag]: any) => {
      sysApi.httpMethod = httpMethodTag[sysApi.httpMethod];
      sysApi.type = typeTag[sysApi.type];
      sysApi.status = statusTag[sysApi.status];
      this.sysApi = sysApi;
    });
  }

  close() {
    this.modal.destroy();
  }
}
