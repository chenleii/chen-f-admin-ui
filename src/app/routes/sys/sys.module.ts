import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {SysRoutingModule} from './sys-routing.module';
import {SysUserComponent} from './user/user.component';
import {SysUserViewComponent} from './user/view/view.component';
import {SysUserEditComponent} from './user/edit/edit.component';
import {SysUserAddComponent} from './user/add/add.component';
import {SysUserSetRoleComponent} from './user/set-role/set-role.component';
import {SysRoleComponent} from './role/role.component';
import {SysRoleViewComponent} from './role/view/view.component';
import {SysRoleEditComponent} from './role/edit/edit.component';
import {SysRoleAddComponent} from './role/add/add.component';
import {SysRoleSetPermissionComponent} from './role/set-permission/set-permission.component';
import {SysPermissionComponent} from './permission/permission.component';
import {SysPermissionViewComponent} from './permission/view/view.component';
import {SysPermissionAddComponent} from './permission/add/add.component';
import {SysPermissionEditComponent} from './permission/edit/edit.component';
import {SysTimedTaskComponent} from './timed-task/timed-task.component';
import {SysTimedTaskViewComponent} from './timed-task/view/view.component';
import {SysTimedTaskAddComponent} from './timed-task/add/add.component';
import {SysTimedTaskEditComponent} from './timed-task/edit/edit.component';
import {SysDruidComponent} from './druid/druid.component';
import {SysApiComponent} from './api/api.component';
import {SysApiViewComponent} from './api/view/view.component';
import {SysApiAddComponent} from './api/add/add.component';
import {SysApiEditComponent} from './api/edit/edit.component';
import {SysMenuComponent} from './menu/menu.component';
import {SysMenuAddComponent} from './menu/add/add.component';
import {SysMenuEditComponent} from './menu/edit/edit.component';
import {SysMenuViewComponent} from './menu/view/view.component';
import {SysPermissionSetMenuComponent} from './permission/set-menu/set-menu.component';
import {SysPermissionSetApiComponent} from './permission/set-api/set-api.component';
import {SysDictionaryComponent} from './dictionary/dictionary.component';
import {SysDictionaryViewComponent} from './dictionary/view/view.component';
import {SysDictionaryEditComponent} from './dictionary/edit/edit.component';
import {SysDictionaryAddComponent} from './dictionary/add/add.component';
import {SysParameterComponent} from './parameter/parameter.component';
import {SysParameterAddComponent} from './parameter/add/add.component';
import {SysParameterEditComponent} from './parameter/edit/edit.component';
import {SysParameterViewComponent} from './parameter/view/view.component';
import {SysTimedTaskLogComponent} from './timed-task-log/timed-task-log.component';
import {SysTimedTaskLogViewComponent} from './timed-task-log/view/view.component';
import {SysDictionaryItemComponent} from './dictionary/item/item.component';
import {SysDictionaryItemEditComponent} from './dictionary/item/edit/edit.component';
import {SysDictionaryItemAddComponent} from './dictionary/item/add/add.component';
import {SysDictionaryItemViewComponent} from './dictionary/item/view/view.component';
import {SysOrganizationComponent} from './organization/organization.component';
import {SysOrganizationViewComponent} from './organization/view/view.component';
import {SysOrganizationEditComponent} from './organization/edit/edit.component';
import {SysOrganizationAddComponent} from './organization/add/add.component';
import {SysOrganizationSetUserComponent} from './organization/set-user/set-user.component';
import {SysOrganizationSetRoleComponent} from './organization/set-role/set-role.component';
import {SysRoleSetMenuComponent} from './role/set-menu/set-menu.component';
import {SysRoleSetApiComponent} from './role/set-api/set-api.component';

const COMPONENTS = [
  SysUserComponent,
  SysRoleComponent,
  SysPermissionComponent,
  SysTimedTaskComponent,
  SysApiComponent,
  SysMenuComponent,
  SysDictionaryComponent,
  SysParameterComponent,
  SysTimedTaskLogComponent,
  SysDictionaryItemComponent,
  SysOrganizationComponent];
const COMPONENTS_NOROUNT = [
  SysUserViewComponent,
  SysUserEditComponent,
  SysUserAddComponent,
  SysUserSetRoleComponent,
  SysRoleViewComponent,
  SysRoleEditComponent,
  SysRoleAddComponent,
  SysRoleSetPermissionComponent,
  SysPermissionViewComponent,
  SysPermissionAddComponent,
  SysPermissionEditComponent,
  SysTimedTaskViewComponent,
  SysTimedTaskAddComponent,
  SysTimedTaskEditComponent,
  SysDruidComponent,
  SysApiViewComponent,
  SysApiAddComponent,
  SysApiEditComponent,
  SysMenuAddComponent,
  SysMenuEditComponent,
  SysMenuViewComponent,
  SysPermissionSetMenuComponent,
  SysPermissionSetApiComponent,
  SysDictionaryViewComponent,
  SysDictionaryEditComponent,
  SysDictionaryAddComponent,
  SysParameterAddComponent,
  SysParameterEditComponent,
  SysParameterViewComponent,
  SysTimedTaskLogViewComponent,
  SysDictionaryItemEditComponent,
  SysDictionaryItemAddComponent,
  SysDictionaryItemViewComponent,
  SysOrganizationViewComponent,
  SysOrganizationEditComponent,
  SysOrganizationAddComponent,
  SysOrganizationSetUserComponent,
  SysOrganizationSetRoleComponent,
  SysRoleSetMenuComponent,
  SysRoleSetApiComponent];

@NgModule({
  imports: [
    SharedModule,
    SysRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysModule {
}
