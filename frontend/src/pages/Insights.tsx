import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import Header from '../components/Header';
import EMITracker from '../components/EMITracker';
import SubscriptionCard from '../components/SubscriptionCard';
import AnomalyFeed from '../components/AnomalyFeed';
import HealthScoreGauge from '../components/HealthScoreGauge';
import PredictiveInsights from '../components/PredictiveInsights';

export default function Insights() {
  const { selectedUser } = useUserStore();
  const [emiData, setEmiData] = useState<any>({ emis: [], totalMonthlyEMI: 0 });
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.emi(selectedUser), api.insights(selectedUser)])
      .then(([em, ins]) => { setEmiData(em.data); setInsights(ins.data); })
      .finally(() => setLoading(false));
  }, [selectedUser]);

  return (
    <div>
      <Header title="Insights" subtitle="Advanced analytics, predictions & financial health" />
      <div className="page-body">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            {insights?.predictions && <PredictiveInsights predictions={insights.predictions} />}

            <div className="two-col">
              <HealthScoreGauge score={insights?.healthScore} />
              <EMITracker emis={emiData.emis} totalMonthlyEMI={emiData.totalMonthlyEMI} />
            </div>

            <div className="full-width">
              <SubscriptionCard subscriptions={insights?.subscriptions || []} />
            </div>

            <div className="full-width">
              <AnomalyFeed anomalies={insights?.anomalies || []} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
