export function Skeleton({ width = '100%', height = '20px', radius = '8px' }) {
  return (
    <div 
      className="skeleton" 
      style={{ 
        width, 
        height, 
        borderRadius: radius 
      }} 
    />
  )
}

export function TransactionSkeleton() {
  return (
    <div className="skeleton-row">
      <Skeleton width="80px" height="28px" />
      <Skeleton width="100px" height="28px" />
      <Skeleton width="120px" height="28px" />
      <Skeleton width="150px" height="28px" />
      <Skeleton width="80px" height="28px" />
    </div>
  )
}

export function SummaryCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton width="60%" height="14px" />
      <Skeleton width="80%" height="32px" />
      <Skeleton width="40%" height="12px" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-hero">
        <Skeleton width="200px" height="16px" />
        <Skeleton width="60%" height="36px" />
        <Skeleton width="80%" height="16px" />
      </div>
      
      <div className="skeleton-stats">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
      
      <div className="skeleton-table">
        <TransactionSkeleton />
        <TransactionSkeleton />
        <TransactionSkeleton />
        <TransactionSkeleton />
        <TransactionSkeleton />
      </div>
    </div>
  )
}