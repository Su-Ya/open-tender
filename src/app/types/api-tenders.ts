export type TTenderCompanies = {
	companies: {
		ids: string[],
		names: string[],
		id_key: { [key:string]: string[] },
		name_key: { [key:string]: string[] }
	}
}

export type TEmptyCompanies = {
	companies: {
		ids: [],
		names: [],
		id_key: {},
		name_key: {}
	}
}

export type T決標公告 = {
  brief: {
    type: '決標公告'
    title: string,
  } & TTenderCompanies
};

export type T定期彙送 = {
  brief: {
    type: '定期彙送'
    title: string,
  } & TTenderCompanies
};

export type T公開招標公告 = {
  brief: {
    type: '公開招標公告'
    title: string,
    category: string,
  } & TEmptyCompanies
};

export type T公開招標更正公告 = {
  brief: {
    type: '公開招標更正公告'
    title: string,
    category: string,
  } & TEmptyCompanies
};

export type T無法決標公告 = {
  brief: {
    type: '無法決標公告'
    title: string,
  } & TEmptyCompanies
};

export type T更正無法決標公告 = {
  brief: {
    type: '更正無法決標公告'
    title: string,
  } & TEmptyCompanies
};

export type T經公開評選或公開徵求之限制性招標公告 = {
  brief: {
    type: '經公開評選或公開徵求之限制性招標公告'
    title: string,
    category: string,
  } & TEmptyCompanies
};

export type T公開取得報價單或企劃書公告 = {
  brief: {
    type: '公開取得報價單或企劃書公告'
    title: string,
    category: string,
  } & TEmptyCompanies
};

export type T公開徵求廠商提供參考資料 = {
  brief: {
    type: '公開徵求廠商提供參考資料'
    title: string,
  } & TEmptyCompanies
};


//標案公告
export type TTenderAnnouncement = {
  date: number,
  filename: string,
  job_number: string,
  unit_id: string,
  unit_name: string,
  unit_api_url: string,
  tender_api_url: string,
  unit_url: string,
  url: string
}

export type TTenderAllBrief = (
  T決標公告 |
  T定期彙送 |
  T公開招標公告 |
  T公開招標更正公告 |
  T無法決標公告 |
  T更正無法決標公告 |
  T經公開評選或公開徵求之限制性招標公告 |
  T公開取得報價單或企劃書公告 |
  T公開徵求廠商提供參考資料
)

export type TTendersApiResponse = {
  page: number,
  query: string,
  records: (
    TTenderAllBrief &
    TTenderAnnouncement
  )[],
  took: number,
  total_pages: number,
  total_records: number
}

export type TenderWinnerBrief = {
  brief: {
    type: '決標公告'
    title: string,
    company: TenderWinner
  }
}

export type TenderWinner = {
  companyId: string,
  name: string,
  codeName: string,
  codeFullName: string,
  tenderWinnerFullKey: string,
}


