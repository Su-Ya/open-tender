import { TTendersApiResponse } from './../types/api-tenders';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TendersService {

  constructor(private httpClient: HttpClient) { }

  getTenders( data: { searchKey: string, page: string } ) {
    return this.httpClient.get<TTendersApiResponse>(`https://pcc.g0v.ronny.tw/api/searchbytitle?query=${data.searchKey}&page=${data.page}`)
  }

  getPublicationOfTender( data: { unitId: any, jobNumber: any } ) {
    return this.httpClient.get(`https://pcc.g0v.ronny.tw/api/tender?unit_id=${data.unitId}&job_number=${data.jobNumber}`)
  }
}
