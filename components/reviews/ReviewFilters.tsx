// components/reviews/ReviewFilters.tsx
export default function ReviewFilters() {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ position: 'relative', minWidth: '200px' }}>
          <select style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            appearance: 'none'
          }}>
            <option>All Sentiments</option>
            <option>Positive</option>
            <option>Negative</option>
          </select>
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>▼</div>
        </div>
  
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="date" 
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}
          />
          <span style={{ color: '#64748b' }}>to</span>
          <input 
            type="date" 
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}
          />
        </div>
  
        <button style={{
          marginLeft: 'auto',
          padding: '10px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 500
        }}>Apply Filters</button>
      </div>
    );
  }
  