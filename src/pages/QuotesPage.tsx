
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { QuotesView } from "@/components/quote/QuotesView";

const QuotesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Quotes" />
      
      <main className="container mx-auto p-4 mt-4">
        <QuotesView />
      </main>
    </div>
  );
};

export default QuotesPage;
