// components/reviews/ReviewDashboard.tsx
import StatsCards from './StatCards';
import ReviewFilters from './ReviewFilters';
import ReviewDataGrid from './ReviewDataGrid';

export default function ReviewDashboard() {
  return (
    <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '32px'
      }}>Review Analytics</h1>
      
      <StatsCards />
      <ReviewFilters />
      <ReviewDataGrid />
    </div>
  );
}
