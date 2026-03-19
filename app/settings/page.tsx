"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    }
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }), // <-- Safely passing the ID to Stripe!
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        console.error("No URL returned from Stripe:", data);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
          
          <div className="mb-8">
            <p className="text-sm text-slate-500 mb-1">Account Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div className="mb-8 p-5 bg-slate-950/50 border border-cyan-900/50 rounded-xl flex flex-col items-start">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Gravity Pro</h3>
            <p className="text-sm text-slate-400 mb-4">Unlock advanced AI tracking, infinite workout history, and premium viral exports.</p>
            <button 
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
            >
              {checkoutLoading ? "Connecting..." : "Upgrade to Pro ($5/mo)"}
            </button>
          </div>

          <button 
            onClick={handleSignOut}
            className="w-full border border-red-900/50 text-red-400 hover:bg-red-950/30 font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}