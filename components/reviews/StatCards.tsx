'use client';
import { useEffect, useState } from 'react';

type StatCard = {
  label: string;
  value: string | number;
  trend: string;
};

export default function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Total Reviews', value: 'Loading...', trend: '' },
    { label: 'Avg Rating', value: 'Loading...', trend: '' },
    { label: 'Positive Sentiment', value: 'Loading...', trend: '' }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        
        setStats([
          { 
            label: 'Total Reviews',
            value: data.documents ?? 0,
            trend: data.documentGrowth ? `+${data.documentGrowth}%` : '' 
          },
          { 
            label: 'Avg Rating',
            value: data.avgRating?.toFixed(1) ?? '0.0',
            trend: data.ratingTrend ? `▲ ${data.ratingTrend}` : '' 
          },
          { 
            label: 'Positive Sentiment',
            value: data.positiveSentiment ? `${Math.round(data.positiveSentiment * 100)}%` : '0%',
            trend: data.sentimentTrend ? `▲ ${Math.round(data.sentimentTrend * 100)}%` : '' 
          }
        ]);
      } catch (error) {
        setStats(prev => prev.map(stat => ({
          ...stat,
          value: 'Error',
          trend: 'Try reloading'
        })));
      }
    };

    fetchStats();
  }, []);

  const isStringValue = (val: any, test: string) => 
    typeof val === 'string' && val.includes(test);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    }}>
      {stats.map((stat, i) => (
        <div key={stat.label} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderTop: `4px solid ${
            isStringValue(stat.value, 'Error') ? '#ef4444' :
            i === 2 ? '#10b981' :    // Green for Positive Sentiment
            i === 1 ? '#f59e0b' :     // Amber for Avg Rating
            '#3b82f6'                // Blue for Total Reviews
          }`
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: '#64748b', 
              fontSize: '14px',
              fontWeight: isStringValue(stat.value, 'Loading') ? 400 : 600
            }}>
              {stat.label}
            </span>
            {stat.trend && (
              <span style={{
                backgroundColor: stat.trend.startsWith('▲') ? '#dcfce7' : '#fee2e2',
                color: stat.trend.startsWith('▲') ? '#166534' : '#991b1b',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '999px'
              }}>
                {stat.trend}
              </span>
            )}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: isStringValue(stat.value, 'Error') ? '#ef4444' : 
                  isStringValue(stat.value, 'Loading') ? '#94a3b8' : '#1e293b',
            marginTop: '8px',
            minHeight: '36px'
          }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
