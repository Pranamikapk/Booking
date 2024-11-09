import { Check, X } from "lucide-react"
import React from "react"
import Card from "../ui/Card"

interface PriceDetailsProps {
  hotelName: string
  hotelImage: string
  price: number
  totalNights: number
  guests: number
  subtotal: number
  cleaningFee?: number
  serviceFee: number
  total: number
  paymentOption: 'full' | 'partial'
}

export const PriceDetails: React.FC<PriceDetailsProps> = ({
  hotelName,
  hotelImage,
  price,
  totalNights,
  guests,
  subtotal,
  cleaningFee = 0,
  serviceFee,
  total,
  paymentOption,
}) => {
  const adjustedTotal = total
  const amountDue = paymentOption === 'full' ? adjustedTotal : adjustedTotal * 0.2

  return (
    <Card className="lg:sticky lg:top-8">
      <div className="p-6 space-y-2 border-b">
        <div className="flex items-center gap-4">
          <img
            src={hotelImage}
            alt={hotelName}
            className="w-[120px] h-[80px] rounded-lg object-cover"
          />
          <div>
            <p className="font-medium">{hotelName}</p>
            <p className="text-sm text-muted-foreground">Entire property</p>
            <div className="flex items-center gap-1 text-sm">
              <span>★ 4.90</span>
              <span className="text-muted-foreground">(88 reviews)</span>
              <span>• Superhost</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Price details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>₹{price.toFixed(2)} × {totalNights} nights</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Complimentary breakfast included
            </div>

            {cleaningFee > 0 ? (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>₹{cleaningFee.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <X className="w-4 h-4 mr-2 text-red-500" />
                No cleaning service provided
              </div>
            )}

            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₹{serviceFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total (INR)</span>
            <span>₹{adjustedTotal.toFixed(2)}</span>
          </div>

          {paymentOption === 'partial' && (
            <>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Due now (20%)</span>
                <span>₹{amountDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Due at check-in (80%)</span>
                <span>₹{(adjustedTotal - amountDue).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Free cancellation for 48 hours</p>
        </div>
      </div>
    </Card>
  )
}