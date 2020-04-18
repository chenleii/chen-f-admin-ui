import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs";

@Component({
  selector: 'app-sys-dictionary-item-view',
  templateUrl: './view.component.html',
})
export class SysDictionaryItemViewComponent implements OnInit {
  record: any = {};
  sysDictionaryItem: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {

    zip(
      this.http.get(`/chen/admin/sys/dictionary/item/${this.record.id}`),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/STATUS",
        {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dictionary/item/alain/tag/VALUE_TYPE",
        {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysDictionaryItem, statusTag, typeTag]: any) => {
      sysDictionaryItem.status = statusTag[sysDictionaryItem.status];
      sysDictionaryItem.keyType = typeTag[sysDictionaryItem.keyType];
      sysDictionaryItem.valueType = typeTag[sysDictionaryItem.valueType];
      this.sysDictionaryItem = sysDictionaryItem;
    });
  }

  close() {
    this.modal.destroy();
  }
}
