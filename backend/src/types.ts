export type FitnessGoal = 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'General Fitness';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type WorkoutLocation = 'Home' | 'Gym' | 'Outdoor';
export type DietPreference = 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  workoutLocation: WorkoutLocation;
  dietaryPreference: DietPreference;
  medicalHistory?: string;
  stressLevel?: 'Low' | 'Medium' | 'High';
  equipmentAvailable?: string[];
}

export interface WorkoutItem {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  focus?: string;
  equipment?: string;
}

export interface WorkoutPlanDay {
  day: string;
  exercises: WorkoutItem[];
  notes?: string;
}

export interface MealItem {
  title: string;
  description: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export interface DietPlanDay {
  day: string;
  meals: MealItem[];
  hydration?: string;
}

export interface PlanResponse {
  workout: WorkoutPlanDay[];
  diet: DietPlanDay[];
  aiTips: string[];
  quote?: string;
  createdAt: string;
  model: string;
}

export interface PlanRequest {
  profile: UserProfile;
  planDuration?: number;
  quoteStyle?: string;
}

export interface PlanSavePayload {
  plan: PlanResponse;
  profile: UserProfile;
  storageKey?: string;
}

