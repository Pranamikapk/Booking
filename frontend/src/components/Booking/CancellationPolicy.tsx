import React from 'react';

export default function CancellationPolicy() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2); 

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short', 
    year: 'numeric', 
    month: 'short',   
    day: 'numeric'    
  });

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Cancellation policy</h2>
      <p className="text-sm">
        Free cancellation for 48 hours.{" "}
        <span className="text-muted-foreground">
          Cancel before {formattedDate} for a partial refund.
        </span>
      </p>
    </div>
  );
}
