"use client";

import ReviewDashboard from '@/components/reviews/ReviewDashboard';

export default function Page() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px'
    }}>
      <ReviewDashboard />
    </div>
  );
}
