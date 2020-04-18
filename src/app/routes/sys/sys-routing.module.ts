import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysUserComponent } from './user/user.component';
import { SysRoleComponent } from './role/role.component';
import { SysPermissionComponent } from './permission/permission.component';
import { SysTimedTaskComponent } from './timed-task/timed-task.component';
import {SysDruidComponent} from "./druid/druid.component";
import { SysApiComponent } from './api/api.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysDictionaryComponent } from './dictionary/dictionary.component';
import { SysParameterComponent } from './parameter/parameter.component';
import { SysTimedTaskLogComponent } from './timed-task-log/timed-task-log.component';
import { SysDictionaryItemComponent } from './dictionary/item/item.component';
import { SysOrganizationComponent } from './organization/organization.component';

const routes: Routes = [

  { path: 'user', component: SysUserComponent },
  { path: 'role', component: SysRoleComponent },
  { path: 'permission', component: SysPermissionComponent },
  { path: 'timed-task', component: SysTimedTaskComponent },
  { path: 'druid', component: SysDruidComponent },
  { path: 'api', component: SysApiComponent },
  { path: 'menu', component: SysMenuComponent },
  { path: 'dictionary', component: SysDictionaryComponent },
  { path: 'parameter', component: SysParameterComponent },
  { path: 'timed-task-log', component: SysTimedTaskLogComponent },
  { path: 'dictionary/item', component: SysDictionaryItemComponent },
  { path: 'organization', component: SysOrganizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
