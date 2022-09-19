import { TTenderAnnouncement, TTenderAllBrief, T決標公告, TenderWinner, TenderWinnerBrief } from './../../types/api-tenders';
import { TendersService } from './../../service/tenders.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-successful-tenderer-analysis',
  templateUrl: './successful-tenderer-analysis.component.html',
  styleUrls: ['./successful-tenderer-analysis.component.scss']
})
export class SuccessfulTendererAnalysisComponent implements OnInit {
  constructor(private tendersService: TendersService) { }

  tenders: ( (TTenderAllBrief & TTenderAnnouncement)[] | [] ) = [];
  tenderProjects: ( (T決標公告 & TTenderAnnouncement)[] | [] ) = [];//決標公告-廠商
  tenderWinners: ( (TenderWinnerBrief & TTenderAnnouncement)[] | [] ) = [];
  originTenderWinnersDetail: Array<object> = [];//決標公告-細節
  tenderWinnersAmount: Array<object> = [];
  tenderWinnersDetailByAmount: Array<object> = [];
  sortInfoDataByAmount = {
    tenderType: '',
    tenderWinnerFullKey: ''
  }
  searchKey = '輿情';
  ngOnInit() {
    this.tendersService.getTenders({ searchKey: this.searchKey, page: 1 }).subscribe( result => {
      this.tenders = result.records;
      this.tenderProjects = this.get決標公告s(this.tenders);
      this.tenderWinners = this.getTenderWinners(this.tenderProjects);
      console.log('>>>>>>> ',this.tenderWinners);
      this.getAllPublicationOfTender();
      /*****************************************
       * 待解問題：
       * forEach 未跑完，就先執行下面 Fn，
       * 造成 Fn 裡的 array
       * riginTenderWinnersDetail 是空的
      *****************************************/
      this.sortTenderWinnersDetailByAmount();

    });
  }

  get決標公告s( data: (TTenderAllBrief & TTenderAnnouncement)[] ): ( (T決標公告 & TTenderAnnouncement)[] | []) {
    const result = data.filter( item => item.brief.type === '決標公告' );
    if(result.length > 0) return result as (T決標公告 & TTenderAnnouncement)[];
    else return [];
  }

  getTenderWinners( data: (T決標公告 & TTenderAnnouncement)[] ): (TenderWinnerBrief & TTenderAnnouncement)[] {
    const winners: (TenderWinnerBrief & TTenderAnnouncement)[] = [];
    return data.reduce( (res, item)=>{
      const winnerItem: TenderWinner = this.getTenderWinner(item);
      const { companies, ...others } = item.brief;
      res = [
        ...res,
        {
          ...item,
          brief: {
            ...others,
            company: winnerItem
          }
        }
      ]
      return res;

    }, winners);
  }

  getTenderWinner( item: (T決標公告 & TTenderAnnouncement) ): TenderWinner {
    let winner: TenderWinner = {
      name: '',
      companyId: '',
      codeName: '',
      codeFullName: '',
      tenderWinnerFullKey: '',
    };

    item.brief.companies.names.reduce( (res, companyName ) => {
      const tenderWinnerFullKey = item.brief.companies.name_key[companyName][1];
      const tenderResult = tenderWinnerFullKey.split(':')[3];
      if( tenderResult === '得標廠商' ) {
        res.name = companyName;
        res.tenderWinnerFullKey = tenderWinnerFullKey;

        // 找得標商 id
        const companyCodeName = item.brief.companies.name_key[companyName][0].split(':')[1];
        for( const [id, value] of Object.entries(item.brief.companies.id_key)) {
            const currentCompanyCodeName = value[0].split(':')[1]

            if(currentCompanyCodeName === companyCodeName ) {
                res.companyId = id;
                res.codeName = currentCompanyCodeName;
                res.codeFullName = value[0];

            }
        }

      }
      return res;

    }, winner)
    return winner;
  }

  getAllPublicationOfTender() {
    const lastIdx = this.tenderWinners.length;
    let counter = 0;
    this.tenderWinners.forEach( item => {
      this.tendersService
        .getPublicationOfTender({
          unitId: item.unit_id,
          jobNumber: item.job_number,
        })
        .subscribe( result => {
          this.originTenderWinnersDetail.push(result);
          this.sortInfoDataByAmount = {
            tenderType: item.brief.type,
            tenderWinnerFullKey: item.brief.company.tenderWinnerFullKey
          }
          // this.tenderWinnersDetailByAmountHandler(result, this.sortInfoDataByAmount);
          if(counter === lastIdx) {
            // return new Promise( (resolve, reject) => resolve('ok') );
            console.log(counter);
            console.log(this.originTenderWinnersDetail);
          }


        });

    });
  }

  tenderWinnersDetailByAmountHandler(tenderWinnerDetail: any, searchData: any) {
    const tender = tenderWinnerDetail.records.find( (recordItem: any) => recordItem.brief.type === searchData.tenderType);
    console.log(tender);
    const splitKey = ':';
    let tenderWinnerKeys = searchData.tenderWinnerFullKey.split(splitKey);
    tenderWinnerKeys.pop();
    const tenderWinnerKey = tenderWinnerKeys.join(splitKey);
    const winnerAmountKey = `${tenderWinnerKey}${splitKey}決標金額`;
    const amountString = tender.detail[winnerAmountKey];
    const winnerAmount = Number( amountString.split('元')[0].split(',').join('') );
    console.log(winnerAmount);
    this.tenderWinnersDetailByAmount.push({
      winnerAmount: winnerAmount,
      ...tenderWinnerDetail
    });
  }

  sortTenderWinnersDetailByAmount() {
    console.log(this.originTenderWinnersDetail);
    this.tenderWinnersDetailByAmount = JSON.parse(JSON.stringify(this.originTenderWinnersDetail))
    console.log(this.tenderWinnersDetailByAmount);
    // this.tenderWinnersDetailByAmount.sort( (a, b) => b.winnerAmount! - a.winnerAmount! );

    type TTenderWinderDetail = {
      unit_name: string,
      records: Array<any>
    }
  }



}
