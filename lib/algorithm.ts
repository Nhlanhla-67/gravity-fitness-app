export function calculateNextTarget(lastReps: number, difficulty: string): number {
    if (difficulty === 'too_easy') return Math.ceil(lastReps * 1.2);
    if (difficulty === 'perfect') return Math.ceil(lastReps * 1.1);
    if (difficulty === 'too_hard') return Math.max(1, Math.ceil(lastReps * 0.8));
    return lastReps;
  }
  
  export async function getTodayWorkout(userId: string, exerciseId: string, supabase: any): Promise<number> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('reps_completed, difficulty')
      .eq('user_id', userId)       // Matches our SQL exactly
      .eq('exercise_id', exerciseId) // Matches our SQL exactly
      .order('logged_at', { ascending: false })
      .limit(1)
      .single();
  
    if (error) {
      // Supabase throws code PGRST116 if no rows exist. That's fine, it just means it's their first day!
      if (error.code === 'PGRST116') {
        return 10; // Return the 10 rep baseline
      }
      // If it's a real error, log it so we can see it
      console.error("Database Error in Algorithm:", error);
      throw error; 
    }
  
    if (data) {
      return calculateNextTarget(data.reps_completed, data.difficulty);
    }
  
    return 10;
  }