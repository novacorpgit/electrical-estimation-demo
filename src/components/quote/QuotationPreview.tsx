
import React from 'react';

interface QuotationPreviewProps {
  quoteData: any;
}

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({ quoteData }) => {
  return (
    <div className="bg-white min-h-screen p-8 border rounded-md shadow-sm print:shadow-none">
      {/* Header with logo and quotation info */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="h-16 w-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            Company Logo
          </div>
          <div className="mt-2">
            <p className="font-medium">Your Company Name</p>
            <p className="text-sm text-gray-500">123 Business Street</p>
            <p className="text-sm text-gray-500">Brisbane, QLD 4000</p>
            <p className="text-sm text-gray-500">Australia</p>
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-3xl font-bold text-blue-900">QUOTATION</h1>
          <p className="font-medium text-xl mt-1"># {quoteData.quoteNumber}</p>
          <p className="mt-4 text-gray-500">Issue Date: {quoteData.createdDate}</p>
          <p className="text-gray-500">Valid Until: {quoteData.expiryDate}</p>
          <p className={`mt-2 px-3 py-1 inline-block rounded-full text-sm font-medium ${
            quoteData.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 
            quoteData.status === 'Sent' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {quoteData.status}
          </p>
        </div>
      </div>
      
      {/* Client and Project Information */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-2">CLIENT</h2>
          <div className="p-4 border rounded-md">
            <p className="font-bold">{quoteData.client.name}</p>
            <p>{quoteData.client.address}</p>
            <p className="mt-3 font-medium">Contact:</p>
            <p>{quoteData.client.contactName}</p>
            <p>{quoteData.client.contactEmail}</p>
            <p>{quoteData.client.contactPhone}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-2">PROJECT DETAILS</h2>
          <div className="p-4 border rounded-md">
            <p><span className="font-medium">Project:</span> {quoteData.project.projectName}</p>
            <p><span className="font-medium">Sub-Project:</span> {quoteData.subProject.name}</p>
            <p><span className="font-medium">Panel Type:</span> {quoteData.subProject.panelType}</p>
            <p><span className="font-medium">Form Type:</span> {quoteData.subProject.formType}</p>
            <p><span className="font-medium">Rating:</span> {quoteData.subProject.boardRating}</p>
            <p><span className="font-medium">Installation:</span> {quoteData.subProject.installationType}</p>
            <p><span className="font-medium">Quantity:</span> {quoteData.subProject.quantity}</p>
          </div>
        </div>
      </div>
      
      {/* Quote Summary */}
      <h2 className="text-lg font-bold text-blue-900 mb-4">QUOTE SUMMARY</h2>
      <table className="w-full mb-10 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3 border">Description</th>
            <th className="text-right p-3 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border">Materials Subtotal</td>
            <td className="text-right p-3 border">{quoteData.subtotalMaterials.toLocaleString('en-AU', {
              style: 'currency',
              currency: quoteData.currency
            })}</td>
          </tr>
          <tr>
            <td className="p-3 border">Labor Subtotal</td>
            <td className="text-right p-3 border">{quoteData.subtotalLabor.toLocaleString('en-AU', {
              style: 'currency',
              currency: quoteData.currency
            })}</td>
          </tr>
          <tr>
            <td className="p-3 border">Additional Costs</td>
            <td className="text-right p-3 border">{quoteData.additionalCosts.toLocaleString('en-AU', {
              style: 'currency',
              currency: quoteData.currency
            })}</td>
          </tr>
          {quoteData.discountPercent > 0 && (
            <tr>
              <td className="p-3 border">Discount ({quoteData.discountPercent}%)</td>
              <td className="text-right p-3 border text-red-600">-{(
                (quoteData.subtotalMaterials + quoteData.subtotalLabor + quoteData.additionalCosts) * 
                (quoteData.discountPercent / 100)
              ).toLocaleString('en-AU', {
                style: 'currency',
                currency: quoteData.currency
              })}</td>
            </tr>
          )}
          <tr>
            <td className="p-3 border">Tax ({quoteData.taxRate}% GST)</td>
            <td className="text-right p-3 border">{(quoteData.finalQuotedValue - 
              (quoteData.finalQuotedValue / (1 + quoteData.taxRate / 100))
            ).toLocaleString('en-AU', {
              style: 'currency',
              currency: quoteData.currency
            })}</td>
          </tr>
          <tr className="bg-blue-50">
            <td className="p-3 border font-bold">TOTAL</td>
            <td className="text-right p-3 border font-bold text-lg">{quoteData.finalQuotedValue.toLocaleString('en-AU', {
              style: 'currency',
              currency: quoteData.currency
            })}</td>
          </tr>
        </tbody>
      </table>
      
      {/* Terms and Conditions */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-blue-900 mb-4">TERMS AND CONDITIONS</h2>
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="font-medium mb-2">Payment Terms</p>
          <p>{quoteData.paymentTerms}</p>
          
          <p className="font-medium mt-4 mb-2">Validity</p>
          <p>This quotation is valid for 30 days from the issue date.</p>
          
          {quoteData.notes && (
            <>
              <p className="font-medium mt-4 mb-2">Notes</p>
              <p>{quoteData.notes}</p>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-10 pt-6 border-t">
        <p>Thank you for your business!</p>
        <p>For any queries regarding this quotation, please contact us at sales@yourcompany.com or call us at +61 7 1234 5678</p>
      </div>
    </div>
  );
};
