
export interface RepairOrder {
    id: string
    technician_id: string
    year: string
    make: string
    model: string
    labor_hours: number
    created_at: string
    [key: string]: any
  }
  