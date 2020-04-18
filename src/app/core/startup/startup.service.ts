import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { ArrayService } from '@delon/util';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    private arrayService: ArrayService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`http://localhost:4200/assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('http://localhost:4200/assets/tmp/app-data.json'),
    ).pipe(
      catchError(([langData, appData]) => {
        resolve(null);
        return [langData, appData];
      }),
    ).subscribe(([langData, appData]) => {
        // Setting language data
        this.translate.setTranslation(this.i18n.defaultLang, langData);
        this.translate.setDefaultLang(this.i18n.defaultLang);

        // Application data
        const res: any = appData;
        // Application information: including site name, description, year
        this.settingService.setApp(res.app);
        // User information: including name, avatar, email address
        this.settingService.setUser(res.user);
        // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
        this.aclService.setFull(true);
        // Menu data, https://ng-alain.com/theme/menu
        this.menuService.add(res.menu);
        // Can be set page suffix title, https://ng-alain.com/theme/title
        this.titleService.suffix = res.app.name;
      },
      () => {
      },
      () => {
        resolve(null);
      });

    zip(
      this.httpClient.get(`http://localhost:4200/assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('http://localhost:4200/assets/tmp/app-data.json'),
      this.httpClient.get('/chen/admin/online/sysUser'),
      this.httpClient.get('/chen/admin/online/sysMenuList'),
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([langData, appData, sysUserData, sysMenuData]) => {
        resolve(null);
        return [langData, appData, sysUserData, sysMenuData];
      }),
    ).subscribe(([langData, appData, sysUserData, sysMenuData]) => {

        // 设置国际化
        this.translate.setTranslation(this.i18n.defaultLang, langData);
        this.translate.setDefaultLang(this.i18n.defaultLang);

        // 设置系统角色与权限
        const sysRoles: string[] = sysUserData.sysUserRoleList.map((sysRole) => {
          return sysRole.name;
        });
        const sysPermissions: string[] = sysUserData.sysUserPermissionList.map((sysPermission) => {
          return sysPermission.name;
        });
        // ACL：设置权限为全量
        // this.aclService.setFull(true);
        this.aclService.setRole(sysRoles);
        this.aclService.setAbility(sysPermissions);

        // 设置系统菜单
        sysMenuData = this.arrayService.arrToTree(sysMenuData, {
          idMapName: 'id',
          parentIdMapName: 'parentId',
          childrenMapName: 'children',
          cb: (item: any) => {
            item.text = item.name;
            item.group = item.type === 'GROUP';
            item.link = item.url;
            item.externalLink = item.type === 'EXTERNAL_LINK';
          },
        });
        this.menuService.clear();
        this.menuService.add(sysMenuData);

        // application data
        const res: any = appData;
        // 应用信息：包括站点名、描述、年份
        this.settingService.setApp(res.app);
        // 用户信息：包括姓名、头像、邮箱地址
        this.settingService.setUser(res.user);
        // 设置页面标题的后缀
        this.titleService.suffix = res.app.name;
      },
      () => {
      },
      () => {
        resolve(null);
      });
  }

  private viaMockI18n(resolve: any, reject: any) {
    this.httpClient
      .get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`)
      .subscribe(langData => {
        this.translate.setTranslation(this.i18n.defaultLang, langData);
        this.translate.setDefaultLang(this.i18n.defaultLang);

        this.viaMock(resolve, reject);
      });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`,
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789',
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: 'Main',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' },
          },
          {
            text: 'Quick Menu',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true,
          },
        ],
      },
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMockI18n(resolve, reject);

    });
  }
}
