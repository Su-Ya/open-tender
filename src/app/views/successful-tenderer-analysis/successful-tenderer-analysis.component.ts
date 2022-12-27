import { TTenderAnnouncement, TTenderAllBrief, T決標公告, TenderWinner, TenderWinnerBrief } from './../../types/api-tenders';
import { TendersService } from './../../service/tenders.service';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-successful-tenderer-analysis',
  templateUrl: './successful-tenderer-analysis.component.html',
  styleUrls: ['./successful-tenderer-analysis.component.scss']
})

export class SuccessfulTendererAnalysisComponent implements OnInit {
  constructor(private tendersService: TendersService) { }

  tenders: any;
  tenderWinners: any;
  searchKey = '輿情';
  searchPage = '1';
  isLoading = true;
  tenderWinnersByAmount: any;
  tenderWinnersByAmountColumns = ['companyName', 'totalAmount'];
  amountTableCurrentRowDetailColumns = ['amount', 'title', 'unitName'];
  amountTableCurrentRow: any;
  amountTableCurrentRowIdx = 0;
  amountTableCurrentRowDetail: any;

  tabsIndex = Object.freeze({
    sortByAmount: -1,
    sortByCount: 1,
  });

  tenderWinnersByCount: any;
  tenderWinnersByCountColumns = ['companyName', 'count'];
  countTableCurrentRowDetailColumns = ['amount', 'title', 'unitName'];
  countTableCurrentRow: any;
  countTableCurrentRowIdx = 0;
  countTableCurrentRowDetail: any;

  ngOnInit() {
    this.fetchTenders();
  }
  fetchTenders() {
    this.isLoading = true;
    this.tendersService.getTenders({ searchKey: this.searchKey, page: this.searchPage }).subscribe( async result => {
      this.tenders = result.records;
      this.tenderWinners = await this.getTenderWinners(this.tenders);
      this.sortTenderWinnersByAmount();
      this.isLoading = false;
      console.log('-----------------------', this.tenderWinners);
    });
  }
  async getTenderWinners( data: any ) {
    const array = [];
    for (const item of data) {
      if(item.brief.type === '決標公告') {
        const winner = await this.getTenderWinner(item);
        console.log('winner ', winner);
        const tenderDetail = await this.getTenderDetail(winner);
        const { displayAmount, amount, detail } = await this.getTenderWinnerDetail(tenderDetail, winner);
        console.log('winner detail ', detail);
        array.push(
          {
            ...winner,
            amount,
            displayAmount,
            apiResponse: {
              ...winner.apiResponse,
              detail
            }
          }
        );

      }

    }

    return array;
  }

  async getTenderWinner( item: any ) {
    console.log('招標列表 api response', item);
    let winner = {
      name: '',
      companyId: '',
      codeName: '',
      codeFullName: '',
      tenderWinnerFullKey: '',
    };

    item.brief.companies.names.reduce( (res: { name: string; tenderWinnerFullKey: string; companyId: string; codeName: string; codeFullName: string; }, companyName: string ) => {
      console.log('>>>>> companyName', companyName);
      const tenderWinnerFullKey = item.brief.companies.name_key[companyName][1];
      const tenderResult = tenderWinnerFullKey.split(':')[3];
      if( tenderResult === '得標廠商' ) {
        res.name = companyName;
        res.tenderWinnerFullKey = tenderWinnerFullKey;
        console.log('>>>>> tenderWinnerFullKey', tenderWinnerFullKey);

        // 找得標商 id
        const companyCodeName = item.brief.companies.name_key[companyName][0].split(':')[1];
        type TIdKey = {
          [key: string]: [string]
        }
        const idKey: TIdKey = item.brief.companies.id_key;
        for( const [id, key] of Object.entries(idKey)) {
          console.log('>>>>> id, key ', id, key);
          const currentCompanyCodeName = key[0].split(':')[1];
          console.log(`>>>>> ${currentCompanyCodeName} === ${companyCodeName}, currentCompanyCodeName === companyCodeName` );

          if(currentCompanyCodeName === companyCodeName ) {
              res.companyId = id;
              res.codeName = currentCompanyCodeName;
              res.codeFullName = key[0];

          }
        }

      }
      return res;
    }, winner);

    return {
      ...winner,
      apiResponse: item
    };
  }

  async getTenderDetail(winner: any) {
    return lastValueFrom(this.tendersService
      .getPublicationOfTender({
        unitId: winner.apiResponse.unit_id,
        jobNumber: winner.apiResponse.job_number,
      })
    );
  }

  async getTenderWinnerDetail(tenderDetail: any, winner: any) {
    const tenderWinnerDetail = tenderDetail.records.find( (recordItem: any) => recordItem.brief.type === winner.apiResponse.brief.type);
    console.log('tenderWinnerDetailHandler',tenderWinnerDetail);

    // 找此得標商的決標金額
    const splitKey = ':';
    let tenderWinnerKeys = winner.tenderWinnerFullKey.split(splitKey);
    tenderWinnerKeys.pop();
    const tenderWinnerKey = tenderWinnerKeys.join(splitKey);
    const winnerAmountKey = `${tenderWinnerKey}${splitKey}決標金額`;
    const amountString = tenderWinnerDetail.detail[winnerAmountKey];
    const winnerAmount = Number( amountString.split('元')[0].split(',').join('') );

    return {
      displayAmount: amountString,
      amount: winnerAmount,
      detail: tenderWinnerDetail.detail
    };
  }

  sortTenderWinnersByAmount() {
    const countResult: {
      string: number
    } = this.tenderWinners.reduce((obj: any, item: any)=>{
      if(item.name in obj) {
        obj[item.name] += item.amount;
      }
      else {
        obj[item.name] = item.amount;
      }
      return obj;

    },{});
    const arr: [string, number][] = Object.entries(countResult);
    this.tenderWinnersByAmount = arr
      .sort( ([, a], [, b]) => b - a)
      .reduce( (res: {name: String, totalAmount: number}[], arrItem) => {
        res = [
          ...res,
          {
            name: arrItem[0],
            totalAmount: arrItem[1]
          }
        ];
        return res;

      }, []);
      console.log('金額排名：',this.tenderWinnersByAmount);
      this.amountTableRowCurrentDetailHandler();
  }

  amountTableRowCurrentDetailHandler() {
    this.amountTableCurrentRow = this.tenderWinnersByAmount[this.amountTableCurrentRowIdx];
    this.amountTableCurrentRowDetail = this.tenderWinners.filter( (item: { name: any; }) => this.amountTableCurrentRow.name === item.name);
    console.log('detail: ', this.amountTableCurrentRowDetail);

  }

  changedAmountTableCurrentRow(idx: number) {
    this.amountTableCurrentRowIdx = idx;
    this.amountTableRowCurrentDetailHandler();
  }

  tabChanged(changeEvent: MatTabChangeEvent): void {
    if(changeEvent.tab.position === this.tabsIndex.sortByAmount) {

    }
    else if(changeEvent.tab.position === this.tabsIndex.sortByCount) {
      this.sortTenderWinnersByCount();

    }

  }

  sortTenderWinnersByCount() {
    const countResult: {
      string: number
    } = this.tenderWinners.reduce((obj: any, item: any)=>{
      if(item.name in obj) {
        obj[item.name]++;
      }
      else {
        obj[item.name] = 1
      }
      return obj;

    },{});

    const arr: [string, number][] = Object.entries(countResult);
    this.tenderWinnersByCount = arr
      .sort( ([, a], [, b]) => b - a)
      .reduce( (res: {name: String, count: number}[], arrItem) => {
        res = [
          ...res,
          {
            name: arrItem[0],
            count: arrItem[1]
          }
        ];
        return res;

      }, []);
    console.log('得標數排名：',this.tenderWinnersByCount);
    this.countTableRowCurrentDetailHandler();
  }

  countTableRowCurrentDetailHandler() {
    this.countTableCurrentRow = this.tenderWinnersByCount[this.countTableCurrentRowIdx];
    this.countTableCurrentRowDetail = this.tenderWinners.filter( (item: { name: any; }) => this.countTableCurrentRow.name === item.name);
    console.log('detail: ', this.countTableCurrentRowDetail);

  }

  changedCountTableCurrentRow(idx: number) {
    this.countTableCurrentRowIdx = idx;
    this.countTableRowCurrentDetailHandler();
  }

  openTenderDetailPage(item: any) {
    console.log('openTenderDetailPage: ',item);
    const url = `https://ronnywang.github.io/pcc-viewer/tender.html?unit_id=${item.apiResponse.unit_id}&job_number=${item.apiResponse.job_number}&date=${item.apiResponse.date}&filename=${item.apiResponse.filename}`;
    window.open(url, '_blank');
  }

  changedPage(event: any) {
    this.clearTables();
    const value = event.target.value;
    if(value === '') return;
    this.searchPage = value;
    this.fetchTenders();
  }
  clearTables() {
    this.tenderWinnersByAmount = [];
    this.amountTableCurrentRowDetail = [];
    this.tenderWinnersByCount = [];
    this.countTableCurrentRowDetail = [];
  }




}
