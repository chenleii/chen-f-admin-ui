import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-sys-menu-view',
  templateUrl: './view.component.html',
})
export class SysMenuViewComponent implements OnInit {
  record: any = {};
  sysMenu: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private cacheService: CacheService,
  ) { }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/menu/${this.record.id}`,),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_MENU.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([sysMenu,typeTag, statusTag]: any[]) => {

      sysMenu.type = typeTag[sysMenu.type];
      sysMenu.status = statusTag[sysMenu.status];
      this.sysMenu = sysMenu;
    });
  }

  close() {
    this.modal.destroy();
  }
}
