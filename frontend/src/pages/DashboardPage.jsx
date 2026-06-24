import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCcw, Trash2 } from 'lucide-react';
import { AppNav } from '../components/PageShell.jsx';
import { deletePlan, getSavedPlans } from '../services/api.js';
import { getSession } from '../services/storage.js';

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const session = getSession();

  async function loadPlans() {
    setLoading(true);
    setError('');
    try {
      setPlans(await getSavedPlans());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(planId) {
    if (!planId) return;
    setError('');
    try {
      await deletePlan(planId);
      setPlans((current) => current.filter((plan) => (plan._id || plan.id) !== planId));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0A0A]">
      <AppNav />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="section-label mb-4">{session?.user ? session.user.name : 'Workspace'}</p>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tight">Saved<br />Startup Plans.</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={loadPlans} className="h-12 px-5 border-2 border-[#0A0A0A] bg-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors">
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
              <Link to="/input" className="h-12 px-6 bg-[#0A0A0A] text-[#F5F3EE] border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors">
                New Plan <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {error && <p className="text-xs font-black uppercase tracking-wide border-l-4 border-[#0A0A0A] pl-3 mb-6">{error}</p>}

          {loading ? (
            <div className="border-2 border-[#0A0A0A] bg-white p-8 text-sm font-black uppercase tracking-widest">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="border-2 border-[#0A0A0A] bg-white p-8">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6A6A6A] mb-3">Empty</p>
              <h2 className="text-3xl font-black uppercase leading-none mb-4">No saved plans yet.</h2>
              <p className="text-sm text-[#6A6A6A] mb-6">Generate a full plan from the results page, then save it to MongoDB.</p>
              <Link to="/input" className="h-12 px-8 inline-flex items-center gap-2 bg-[#0A0A0A] text-[#F5F3EE] border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#0A0A0A] transition-colors">Start Now <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {plans.map((entry, index) => {
                const plan = entry.plan || entry;
                const id = entry._id || entry.id;
                return (
                  <article key={id || `${plan.startup_name}-${index}`} className={`border-2 border-[#0A0A0A] bg-white p-6 ${index % 3 !== 0 ? 'xl:border-l-0' : ''} ${index % 2 !== 0 ? 'md:border-l-0 xl:border-l-2' : ''} ${index >= 2 ? 'md:border-t-0 xl:border-t-2' : ''} ${index >= 3 ? 'xl:border-t-0' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Saved Plan</p>
                        <h2 className="text-xl font-black uppercase leading-tight">{plan.startup_name || 'Untitled Plan'}</h2>
                      </div>
                      {id && (
                        <button onClick={() => handleDelete(id)} className="h-9 w-9 border-2 border-[#0A0A0A] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors" aria-label="Delete plan">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-[#3A3A3A] border-l-2 border-[#0A0A0A] pl-3 mb-5 leading-relaxed">{plan.pitch || plan.problem || 'No pitch saved.'}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wide">
                      <span className="border border-[#0A0A0A] p-2">Score {Number(plan.opportunity_score || 0).toFixed(1)}</span>
                      <span className="border border-[#0A0A0A] p-2">{plan.mvp_features?.length || 0} MVP Items</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
