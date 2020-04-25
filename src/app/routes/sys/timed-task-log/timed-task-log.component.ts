import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { zip } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { SysTimedTaskLogViewComponent } from './view/view.component';

@Component({
  selector: 'app-sys-timed-task-log',
  templateUrl: './timed-task-log.component.html',
})
export class SysTimedTaskLogComponent implements OnInit {
  @ViewChild('sf', { static: true }) sf: SFComponent;
  params: any = {};
  searchSchema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
      className: { type: 'string', title: '类名' },
      type: {
        type: 'string', title: '类型',
        enum: [],
        ui: {
          widget: 'select',
        },
      },
      executionStatus: {
        type: 'string', title: '执行状态',
        enum: [],
        ui: {
          widget: 'select',
        },
      },
      remark: {
        type: 'string', title: '备注',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
    },
    ui: {
      // spanLabel: 10,
      // spanControl: 14,
      grid: {
        span: 6,
      },
    },
  };
  ui: SFUISchema = {};


  @ViewChild('st', { static: true }) st: STComponent;
  url = `/chen/admin/sys/timedTask/log`;
  req: STReq = {
    params: this.params,
    reName: {
      pi: 'pageIndex',
      ps: 'pageSize',
    },
  };
  res: STRes = {
    reName: {
      total: 'total',
      list: 'list',
    },
  };
  page: STPage = {
    front: false,
    show: true,

    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true,
  };
  columns: STColumn[] = [
    { title: 'ID', index: 'id', sort: true },
    { title: '系统定时任务ID', index: 'sysTimedTaskId', sort: true },
    { title: '编码', index: 'code', sort: true },
    { title: '名称', index: 'name', sort: true },
    { title: '类名', index: 'className', sort: true },
    { title: 'CORN表达式', index: 'cronExpression' },
    { title: '数据', index: 'data' },
    { title: '类型', index: 'type', type: 'tag', tag: {} },
    { title: '执行状态', index: 'executionStatus', type: 'tag', tag: {} },
    { title: '异常信息', index: 'exceptionMessage' },
    { title: '执行开始日期时间', index: 'executionStartDateTime', type: 'date' },
    { title: '执行结束日期时间', index: 'executionEndDateTime', type: 'date' },
    { title: '执行时间（毫秒）', index: 'executionTime' },
    { title: '备注', index: 'remark' },
    // { title: '修改的日期时间', index: 'updatedDateTime', type: 'date', default: '未修改过' },
    // { title: '创建的日期时间', index: 'createdDateTime', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'none',
          click: (item: any, modal: any, instance: STComponent) => {
            this.modal.create(SysTimedTaskLogViewComponent, { 'record': item }).subscribe();
          },
        }, {
          text: '删除', type: 'del',
          click: (item: any, modal: any, instance: STComponent) => {
            this.http.delete(`/chen/admin/sys/timedTask/log/${item.id}`).subscribe((res: any) => {
              // 刷新当前页
              this.st.reload();
            });
          },
        },
      ],
    },
  ];


  constructor(private http: _HttpClient, private modal: ModalHelper, private cacheService: CacheService,
              private msgSrv: NzNotificationService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_TIMED_TASK.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/SYS_TIMED_TASK.EXECUTION_STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/tag/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeTag, executionStatusTag, statusTag]: any[]) => {
      this.columns.forEach((value) => {
        if (value.index === 'type') {
          value.tag = typeTag;
        }
        if (value.index === 'executionStatus') {
          value.tag = executionStatusTag;
        }
        // if (value.index === 'status') {
        //   value.tag = statusTag;
        // }
      });

      this.st.resetColumns({ columns: this.columns }).then();
    });

    zip(
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_TIMED_TASK.TYPE',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/SYS_TIMED_TASK.EXECUTION_STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
      this.cacheService.get('/chen/common/sys/dictionary/item/alain/select/STATUS',
        { mode: 'promise', type: 's', expire: 86400 }),
    ).subscribe(([typeSelect, executionStatusSelect, statusSelect]: any[]) => {

      this.searchSchema.properties.type.enum = typeSelect;
      this.searchSchema.properties.executionStatus.enum = executionStatusSelect;
      // this.searchSchema.properties.status.enum = statusSelect;

      try {
        this.sf.refreshSchema();
      } catch (e) {
        // 如果有缓存就会异常"ERROR Error: Invalid Schema"
      }

    });

  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
