import React from 'react';

export default function CancellationPolicy() {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Cancellation policy</h2>
      <p className="text-sm">
        Free cancellation for 48 hours.{" "}
        <span className="text-muted-foreground">Cancel before 10 Nov for a partial refund.</span>
      </p>
      <a href="#" className="text-sm underline">
        Learn more
      </a>
    </div>
  )
}