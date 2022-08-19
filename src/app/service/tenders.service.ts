import { ApiResponseTenders } from './../types/api-tenders';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TendersService {

  constructor(private httpClient: HttpClient) { }

  getTenders( data: { searchKey: string, page: number } ) {
    return this.httpClient.get<ApiResponseTenders>(`https://pcc.g0v.ronny.tw/api/searchbytitle?query=${data.searchKey}&page=${data.page}`)
  }
}
