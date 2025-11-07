import { TTendersApiResponse } from './../types/api-tenders';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TendersService {

  constructor(private httpClient: HttpClient) { }

  getTenders( data: { searchKey: string, page: string } ) {
    return this.httpClient.get<TTendersApiResponse>(`https://pcc-api.openfun.app/api/searchbytitle?query=${data.searchKey}&page=${data.page}`)
  }

  getPublicationOfTender( data: { unitId: any, jobNumber: any } ) {
    return this.httpClient.get(`https://pcc-api.openfun.app/api/tender?unit_id=${data.unitId}&job_number=${data.jobNumber}`)
  }
}
