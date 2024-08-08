export interface task {
  id?: string
  title: string
  description: string
  status: string
  cre_date?: Date
  upd_date?: Date
}

export const API_DATA_UPLOAD = {
  DATA_UPLOADED: false,
  TASK_DATA: [] as task[]
}
