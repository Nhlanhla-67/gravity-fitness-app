"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  userId: string;
  exerciseId: string;
}

export default function ProgressChart({ userId, exerciseId }: ProgressChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      
      // Fetching the data using the exact snake_case column names your database uses
      const { data: logs, error } = await supabase
        .from('workout_logs')
        .select('reps_completed, logged_at')
        .eq('user_id', userId) 
        .eq('exercise_id', exerciseId)
        .order('logged_at', { ascending: true });

      if (error) {
        console.error("Chart fetch error:", error);
        setLoading(false);
        return;
      }

      if (logs) {
        // Format the date so it looks nice on the graph (e.g., "Mar 17")
        const formattedData = logs.map(log => {
          const date = new Date(log.logged_at);
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reps: log.reps_completed
          };
        });
        
        setData(formattedData);
      }
      setLoading(false);
    }

    if (userId && exerciseId) {
      fetchHistory();
    }
  }, [userId, exerciseId]);

  if (loading) {
    return <div className="text-center text-slate-500 text-sm py-8">Loading progress...</div>;
  }

  // Need at least 2 points to draw a line
  if (data.length < 2) {
    return (
      <div className="border border-slate-800 rounded-xl p-6 mt-6 bg-slate-900/50 text-center">
        <h3 className="text-cyan-500 font-semibold text-sm mb-1">Progress</h3>
        <p className="text-slate-400 text-xs">Complete more workouts to unlock your progress chart.</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-xl p-6 mt-6 bg-slate-900/50">
      <h3 className="text-white font-semibold text-sm mb-6">Your Progress</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#06b6d4' }}
            />
            <Line 
              type="monotone" 
              dataKey="reps" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#0f172a', stroke: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#06b6d4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}