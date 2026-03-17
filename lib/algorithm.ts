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

  export function getDailyRoutine(allExercises: any[]) {
    // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = new Date().getDay();
    
    let routineName = "";
    let targetBodyParts: string[] = [];
  
    // Define the split based on the day
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      routineName = "Upper Body Burn";
      targetBodyParts = ['Chest/Triceps', 'Shoulders'];
    } else if (dayOfWeek === 2 || dayOfWeek === 5) {
      routineName = "Lower Body Power";
      targetBodyParts = ['Legs'];
    } else if (dayOfWeek === 3 || dayOfWeek === 6) {
      routineName = "Core & Conditioning";
      targetBodyParts = ['Core', 'Core/Cardio'];
    } else {
      routineName = "Full Body Active Recovery";
      targetBodyParts = ['Full Body', 'Core'];
    }
  
    // Filter the database exercises to match today's target body parts
    const todaysExercises = allExercises.filter(ex => 
      targetBodyParts.includes(ex.body_part) || ex.body_part === 'Full Body'
    ).slice(0, 3); // Grab up to 3 exercises for the stack
  
    // Fallback in case the filtering misses
    const finalExercises = todaysExercises.length > 0 ? todaysExercises : allExercises.slice(0, 3);
  
    return {
      routineName,
      exercises: finalExercises
    };
  }