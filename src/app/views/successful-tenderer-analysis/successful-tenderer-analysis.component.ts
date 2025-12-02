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
  totalPages = 1;
  isLoading = true;
  tenderWinnersByAmount: any;
  tenderWinnersByAmountColumns = ['companyName', 'totalAmount'];
  amountTableCurrentRowDetailColumns = ['amount', 'title', 'time', 'unitName'];
  amountTableCurrentRow: any;
  amountTableCurrentRowIdx = 0;
  amountTableCurrentRowDetail: any;

  tenderWinnersByCount: any;
  tenderWinnersByCountColumns = ['companyName', 'count'];
  countTableCurrentRowDetailColumns = ['amount', 'title', 'time', 'unitName'];
  countTableCurrentRow: any;
  countTableCurrentRowIdx = 0;
  countTableCurrentRowDetail: any;

  ngOnInit() {
    this.fetchTenders();
  }
  fetchTenders() {
    this.isLoading = true;
    this.tendersService
    .getTenders({ searchKey: this.searchKey, page: this.searchPage })
    .subscribe(
      async (result) => {
        this.totalPages = result.total_pages;
        this.tenders = result.records;
        this.tenderWinners = await this.getTenderWinners(this.tenders);
        this.sortTenderWinnersByAmount();
        this.isLoading = false;
        console.log('-----------------------', this.tenderWinners);
      },
      (error) => {
        console.error('Error fetching tenders:', error);
        this.isLoading = false;
        alert('伺服器忙碌中，請稍後再試');
      }
    );
  }

  async getTenderWinners( data: any ) {
    const array = [];
    for (const item of data) {
      if(item.brief.type === '決標公告') {
        const winner = this.getTenderWinner(item);
        console.log('winner ', winner);
        const detailPromise = new Promise( async (resolve, reject) => {
          try {
            const tenderDetail = await lastValueFrom(this.getTenderWinnerDetailObservable(winner));
            const { displayAmount, amount, openTime, closeTime, detail } = this.formatTenderWinnerDetail(tenderDetail, winner);
            console.log('winner detail ', detail);
            resolve(
              {
                ...winner,
                amount,
                displayAmount,
                openTime,
                closeTime,
                apiResponse: {
                  ...winner.apiResponse,
                  detail
                }
              }
            );
          } catch (error) {
            resolve(null);
          }

        });

        array.push(detailPromise);
      }
    }

    const results = await Promise.all(array);

    // 過濾掉失敗的 null 結果，並將成功的與錯誤清單合併
    const successfulResults = results.filter(r => r !== null);

    return successfulResults;
  }

  getTenderWinner( item: any ) {
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

      const tenderWinnerFullKey = item.brief.companies.name_key[companyName]
      .find( (str: string) => {
        if( str.includes('決標品項') && !str.includes('未得標廠商') && str.includes('得標廠商')) return str;
        else return undefined;
      });
      console.log('>>>>> tenderWinnerFullKey', tenderWinnerFullKey);

      const tenderResult = tenderWinnerFullKey?.split(':')[3];
      if( tenderResult === '得標廠商' ) {
        res.name = companyName;
        res.tenderWinnerFullKey = tenderWinnerFullKey;

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

  getTenderWinnerDetailObservable(winner: any) {
    return this.tendersService
      .getPublicationOfTender({
        unitId: winner.apiResponse.unit_id,
        jobNumber: winner.apiResponse.job_number,
      });
  }

  formatTenderWinnerDetail(tenderDetail: any, winner: any) {
    const tenderWinnerDetail = tenderDetail.records.find( (recordItem: any) => recordItem.brief.type === winner.apiResponse.brief.type);
    console.log('tenderWinnerDetailHandler',tenderWinnerDetail);

    // 找此得標商的決標金額
    const amountString = tenderWinnerDetail.detail['決標資料:總決標金額'];
    const winnerAmount = Number( amountString.split('元')[0].split(',').join('') );

    const openTime1 = tenderWinnerDetail.detail['採購資料:開標時間'];
    const openTime2 = tenderWinnerDetail.detail['已公告資料:開標時間'];
    const closeTime = tenderWinnerDetail.detail['決標資料:決標日期'];

    return {
      displayAmount: amountString,
      amount: winnerAmount,
      openTime: openTime1? openTime1:openTime2,
      closeTime,
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

  tabsLabel = Object.freeze({
    sortByAmount: '金額排名',
    sortByCount: '得標數排名',
    sortByMonth: '每月得標',
  });
  tabChanged(changeEvent: MatTabChangeEvent): void {
    if(changeEvent.tab.textLabel === this.tabsLabel.sortByAmount) {

    }
    else if(changeEvent.tab.textLabel === this.tabsLabel.sortByCount) {
      this.sortTenderWinnersByCount();

    }
    else if(changeEvent.tab.textLabel === this.tabsLabel.sortByMonth) {
      this.tenderWinnersCountByMonth();

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
    const value = event.target.value;
    if(value === '') return;

    if(+value > this.totalPages) {
      alert('超過總頁數');
      return;
    }

    this.clearTables();
    this.searchPage = value;
    this.fetchTenders();
  }
  clearTables() {
    this.tenderWinnersByAmount = [];
    this.amountTableCurrentRowDetail = [];
    this.tenderWinnersByCount = [];
    this.countTableCurrentRowDetail = [];
  }

  tenderWinnersCountPerMonth: any;
  perMonthTableColumns = ['month', 'count'];
  analysisMapByMonth: any;
  tenderWinnersCountByMonth() {
    this.analysisMapByMonth = this.tenderWinners.reduce( (mapRes: any, item: any)=>{
        const times = item.closeTime.split('/');
        const YYY = times[0];
        const MM = times[1];
        const dd = times[2];
        const mapKey = `${YYY}/${MM}`;
        if(mapRes.get(mapKey)) {
            const data = [...mapRes.get(mapKey), item];
            mapRes.set(mapKey, data);

        }
        else {
            const data = [item];
            mapRes.set(mapKey, data);

        }
        return mapRes;

    }, new Map());

    this.tenderWinnersCountPerMonth = [...this.analysisMapByMonth.keys()];
    this.perMonthDetailTable = this.analysisMapByMonth.get(this.tenderWinnersCountPerMonth[0]);

  };

  perMonthDetailTable = [];
  perMonthDetailTableColumns = ['amount', 'title', 'time', 'unitName'];
  perMonthTableCurrentRowIdx = 0;
  changedCountTableCurrentRowByMonth(idx: number, mapKey: string) {
    this.perMonthTableCurrentRowIdx = idx;
    this.perMonthDetailTable = this.analysisMapByMonth.get(mapKey);

  }




}
