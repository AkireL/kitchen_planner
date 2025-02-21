export interface Recipe {
  id: number | string;
  title: string | null;
  ingredients: string[];
  preparation: string;
  duration: string;
  schedule_at: string;
}

export interface Recipes {
  id: number | string;
  day: string;
  date: string | null;
  list: Recipe[];
}

export interface RangeDate {
  firstDate: Date | null;
  lastDate: Date | null;
}

export interface RecipeFiltersParams {
  start_date: string;
  end_date: string;
}
