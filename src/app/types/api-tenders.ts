export interface ApiResponseTenders {
  page: number,
  query: string,
  records: TenderAllProject[],
  took: number,
  total_pages: number,
  total_records: number
}

export type TenderAllProject = TenderProject決標公告 |
  TenderProject定期彙送 |
  TenderProject公開招標公告 |
  TenderProject公開招標更正公告 |
  TenderProject無法決標公告 |
  TenderProject更正無法決標公告 |
  TenderProject經公開評選或公開徵求之限制性招標公告 |
  TenderProject公開取得報價單或企劃書公告 |
  TenderProject公開徵求廠商提供參考資料

export type TenderProjectType決標公告 = '決標公告'
export interface TenderProject決標公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType決標公告,
    title: string,
    companies: {
      ids: string[],
      names: string[],
      id_key: object,
      name_key: object
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType定期彙送 = '定期彙送'
export interface TenderProject定期彙送 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType定期彙送,
    title: string,
    companies: {
      ids: string[],
      names: string[],
      id_key: object,
      name_key: object
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType公開招標公告 = '公開招標公告'
export interface TenderProject公開招標公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType公開招標公告,
    title: string,
    category: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType公開招標更正公告 = '公開招標更正公告'
export interface TenderProject公開招標更正公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType公開招標更正公告,
    title: string,
    category: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType無法決標公告 = '無法決標公告'
export interface TenderProject無法決標公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType無法決標公告,
    title: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType更正無法決標公告 = '更正無法決標公告'
export interface TenderProject更正無法決標公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType更正無法決標公告,
    title: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType經公開評選或公開徵求之限制性招標公告 = '經公開評選或公開徵求之限制性招標公告'
export interface TenderProject經公開評選或公開徵求之限制性招標公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType經公開評選或公開徵求之限制性招標公告,
    title: string,
    category: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType公開取得報價單或企劃書公告 = '公開取得報價單或企劃書公告'
export interface TenderProject公開取得報價單或企劃書公告 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType公開取得報價單或企劃書公告,
    title: string,
    category: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TenderProjectType公開徵求廠商提供參考資料 = '公開徵求廠商提供參考資料'
export interface TenderProject公開徵求廠商提供參考資料 {
  date: number,
  filename: string,
  brief: {
    type: TenderProjectType公開徵求廠商提供參考資料,
    title: string,
    companies: {
      ids: [],
      names: [],
      id_key: {},
      name_key: {}
    }
  },
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}
