import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-parameter-view',
  templateUrl: './view.component.html',
})
export class SysParameterViewComponent implements OnInit {
  record: any = {};
  sysParameter: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public cacheService: CacheService,
  ) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/parameter/${this.record.id}`),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/VALUE_TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_PARAMETER.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysParameter, valueTypeTag, typeTag, statusTag]: any[]) => {

      sysParameter.valueType = valueTypeTag[sysParameter.valueType];
      sysParameter.type = typeTag[sysParameter.type];
      sysParameter.status = statusTag[sysParameter.status];
      this.sysParameter = sysParameter;
    });
  }

  close() {
    this.modal.destroy();
  }
}
