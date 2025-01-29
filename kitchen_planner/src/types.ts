export interface Recipe {
  id: number
  title: string | null
  ingredients: string[]
  preparation: string
  duration: string
  schedule_at: string
}

export interface Recipes {
  id: number
  day: string
  list: Recipe[]
}
