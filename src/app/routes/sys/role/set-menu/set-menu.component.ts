import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzTreeNode, NzTreeComponent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {ArrayService} from "@delon/util";
import {zip} from "rxjs";

@Component({
  selector: 'app-sys-role-set-menu',
  templateUrl: './set-menu.component.html',
})
export class SysRoleSetMenuComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/menu/all/enabled`),
      this.http.get(`/chen/admin/online/sysMenuList`),
      this.http.get(`/chen/admin/sys/role/menu/${this.record.id}`),
    ).subscribe(([sysMenuList, onlineSysUserMenuList, sysRoleMenuList]: any) => {
      this.sysMenuList = sysMenuList;

      const checkedSysMenuIdList = sysRoleMenuList.map((sysMenu) => {
        return sysMenu.id;
      });

      this.sysMenuTreeNode = this.arrayService.arrToTreeNode(onlineSysUserMenuList, {
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
    this.http.put(`/chen/admin/sys/role/${this.record.id}/setSysMenu`, {sysMenuIdList: keysByTreeNode}).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
