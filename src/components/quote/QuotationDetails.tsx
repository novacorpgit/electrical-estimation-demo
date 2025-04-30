
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuotationDetailsProps {
  quoteData: any;
}

export const QuotationDetails: React.FC<QuotationDetailsProps> = ({ quoteData }) => {
  // Calculate the values for display
  const subtotal = quoteData.subtotalMaterials + quoteData.subtotalLabor;
  
  // Calculate margin amount based on margin type
  let marginAmount = 0;
  if (quoteData.marginType === "markup") {
    marginAmount = subtotal * (quoteData.marginPercent / 100);
  } else {
    // Margin calculation
    marginAmount = subtotal / (1 - (quoteData.marginPercent / 100)) - subtotal;
  }
  
  // Calculate other values
  const afterMargin = subtotal + marginAmount;
  const afterAdditional = afterMargin + quoteData.additionalCosts;
  const discount = afterAdditional * (quoteData.discountPercent / 100);
  const afterDiscount = afterAdditional - discount;
  const tax = afterDiscount * (quoteData.taxRate / 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Materials & Labor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Materials</p>
                <p className="text-xl font-bold text-blue-700">
                  {quoteData.subtotalMaterials.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Labor</p>
                <p className="text-xl font-bold text-green-700">
                  {quoteData.subtotalLabor.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </p>
              </div>
            </div>
            
            {/* Detailed Breakdown */}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span className="font-medium">
                  {subtotal.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>{quoteData.marginType === "markup" ? "Markup" : "Margin"} ({quoteData.marginPercent}%)</span>
                <span className="font-medium">
                  {marginAmount.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>After {quoteData.marginType === "markup" ? "Markup" : "Margin"}</span>
                <span className="font-medium">
                  {afterMargin.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>Additional Costs</span>
                <span className="font-medium">
                  {quoteData.additionalCosts.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>After Additional Costs</span>
                <span className="font-medium">
                  {afterAdditional.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              {quoteData.discountPercent > 0 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span>Discount ({quoteData.discountPercent}%)</span>
                    <span className="font-medium text-red-600">
                      -{discount.toLocaleString('en-AU', {
                        style: 'currency',
                        currency: quoteData.currency
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span>After Discount</span>
                    <span className="font-medium">
                      {afterDiscount.toLocaleString('en-AU', {
                        style: 'currency',
                        currency: quoteData.currency
                      })}
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between py-2 border-b">
                <span>Tax ({quoteData.taxRate}% GST)</span>
                <span className="font-medium">
                  {tax.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-3 font-bold text-lg">
                <span>Final Quoted Value</span>
                <span>
                  {quoteData.finalQuotedValue.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: quoteData.currency
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
