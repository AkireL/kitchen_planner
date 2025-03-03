export interface Recipe {
  id: number | string;
  title: string | null;
  ingredients: string[];
  preparation?: string;
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

export interface AuthInterface {
  id?: string;
  email?: string;
  username?: string;
  full_name?: string;
}

export interface userInterface {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export interface logInInterface {
  username: string;
  password: string;
  scope: string;
  client_id: string;
  grant_type: string;
  client_secret: string;
}
