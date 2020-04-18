import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs";

@Component({
  selector: 'app-sys-dictionary-view',
  templateUrl: './view.component.html',
})
export class SysDictionaryViewComponent implements OnInit {
  record: any = {};
  sysDictionary: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/dictionary/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/SYS_DICTIONARY.TYPE", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysDictionary, statusTag,typeTag]: any) => {
      sysDictionary.type = typeTag[sysDictionary.type];
      sysDictionary.status = statusTag[sysDictionary.status];
      this.sysDictionary = sysDictionary;
    });
  }

  close() {
    this.modal.destroy();
  }
}
