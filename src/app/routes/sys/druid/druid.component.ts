import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "@env/environment";

@Component({
  selector: 'app-sys-druid',
  templateUrl: './druid.component.html',
})
export class SysDruidComponent implements OnInit {
  link: string = environment.SERVER_URL + "/druid/index.html";

  constructor(
    private sanitizer: DomSanitizer,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {

  }


}
