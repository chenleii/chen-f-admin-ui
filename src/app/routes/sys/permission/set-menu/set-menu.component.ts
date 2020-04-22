import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CacheService } from '@delon/cache';
import { zip } from 'rxjs';
import { ArrayService } from '@delon/util';

@Component({
  selector: 'app-sys-permission-set-menu',
  templateUrl: './set-menu.component.html',
})
export class SysPermissionSetMenuComponent implements OnInit {
  // 编辑的记录
  record: any = {};

  @ViewChild('nzTree', { static: true })  nzTree: NzTreeComponent;

  // 所有启用的菜单
  sysMenuList: any[];
  // 所有启用的菜单转为树的形式
  sysMenuTreeNode: NzTreeNode[];
  // 选中的系统菜单
  checkedSysMenuIdList: string[];

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    public cacheService: CacheService,
    private arrayService: ArrayService
  ) {
  }

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/menu/all/enabled`),
      this.http.get(`/chen/admin/online/sysMenuList`),
      this.http.get(`/chen/admin/sys/permission/menu/${this.record.id}`),
    ).subscribe(([sysMenuList, onlineSYsUserMenuList, sysPermissionMenuList]: any) => {
      this.sysMenuList = sysMenuList;

      const checkedSysMenuIdList = sysPermissionMenuList.map((sysMenu) => {
        return sysMenu.id;
      });

      this.sysMenuTreeNode = this.arrayService.arrToTreeNode(onlineSYsUserMenuList, {
        idMapName: 'id',
        parentIdMapName: 'parentId',
        cb: (item: any) => {
          item.key = item.id;
          item.title = item.name;
          item.disabled = item.status === 'DISABLED';
          if (item.isLeaf) {
            item.checked = checkedSysMenuIdList.includes(item.id);
          }
        },
      });

    });
  }

  save() {
    const keysByTreeNode = this.arrayService.getKeysByTreeNode(this.sysMenuTreeNode);
    this.http.put(`/chen/admin/sys/permission/${this.record.id}/setSysMenu`, {sysMenuIdList: keysByTreeNode}).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
