import { TTenderAnnouncement, TTenderAllBrief, T決標公告, TenderWinner, TenderWinnerBrief } from './../../types/api-tenders';
import { TendersService } from './../../service/tenders.service';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-successful-tenderer-analysis',
  templateUrl: './successful-tenderer-analysis.component.html',
  styleUrls: ['./successful-tenderer-analysis.component.scss']
})
export class SuccessfulTendererAnalysisComponent implements OnInit {
  constructor(private tendersService: TendersService) { }

  tenders: any;
  tenderWinners: any;
  tenderWinnersByAmount: any;
  searchKey = '輿情';
  searchPage = 1;
  isLoading = true;

  ngOnInit() {
    this.tendersService.getTenders({ searchKey: this.searchKey, page: this.searchPage }).subscribe( async result => {
      this.tenders = result.records;
      this.tenderWinners = await this.getTenderWinners(this.tenders);
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
    this.tenderWinnersByAmount = JSON.parse(JSON.stringify(this.tenderWinners));
    this.tenderWinnersByAmount.sort( (a: { amount: any; }, b: { amount: any; }) => b.amount! - a.amount! );
  }



}
