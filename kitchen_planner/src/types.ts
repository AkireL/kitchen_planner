export interface Recipe {
  id: number | string
  title: string | null
  ingredients: string[]
  preparation: string
  duration: string
  schedule_at: string
}

export interface Recipes {
  id: number | string
  day: string
  date: string | null
  list: Recipe[]
}
