"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Helper function to translate YYYY-MM-DD into Dhivehi format
const formatDhivehiDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; // Returns original if format is unexpected
  
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const months = [
    "ޖެނުއަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރީލް",
    "މޭ", "ޖޫން", "ޖުލައި", "އޮގަސްޓް",
    "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ"
  ];
  
  return `${day} ${months[monthIndex]} ${year}`;
};

function VerificationContent() {
  const searchParams = useSearchParams();
  const permitNumber = searchParams.get('verify');
  
  const [permit, setPermit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (permitNumber) {
      fetchPermit(permitNumber);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  }, [permitNumber]);

  const fetchPermit = async (numberToVerify: string) => {
    try {
      const { data, error } = await supabase
        .from('permits')
        .select('*')
        .eq('permit_number', numberToVerify)
        .single();

      if (error || !data) {
        setIsError(true);
      } else {
        setPermit(data);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Applied the exact background color, repeating SVG wave pattern, text-shadow, and inner box-shadow from the source CSS
    <div 
      className="flex flex-col w-full min-h-screen text-[#dee2e6] font-sans"
      style={{ 
        backgroundColor: '#283593', 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'250\' height=\'30\' viewBox=\'0 0 1000 120\'%3E%3Cg fill=\'none\' stroke=\'%23222222\' stroke-width=\'2.1\' %3E%3Cpath d=\'M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3Cpath d=\'M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3Cpath d=\'M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3Cpath d=\'M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3Cpath d=\'M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3Cpath d=\'M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30\'/%3E%3C/g%3E%3C/svg%3E")', 
        textShadow: '0 .05rem .1rem rgba(0, 0, 0, .5)', 
        boxShadow: 'inset 0 0 5rem rgba(0, 0, 0, .5)' 
      }}
    >
      <div className="flex flex-col w-full min-h-screen p-[1rem] mx-auto max-w-[62em]">
        
        {/* Header */}
        <header className="mb-auto text-center">
          <div className="mx-[3rem] pb-[1rem] flex flex-col md:flex-row justify-between items-center">
            <a className="text-white text-decoration-none" href="/">
              <h3 className="float-none md:float-left mb-0 text-[1.75rem] font-medium text-white">Vehicle Import Permit Verification</h3>
            </a>
            <nav className="flex justify-center float-none md:float-right mt-[0.5rem] md:mt-0 gap-[1rem]">
              <a className="text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.75)] hover:border-b hover:border-[rgba(255,255,255,0.25)] border-b-4 border-transparent font-bold py-[0.25rem] px-0 transition-all" href="/Contact">Contact</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-[1rem] w-full mt-[3rem]">
          
          <div className="text-center flex justify-center">
            <img 
              src="/emblem.svg" 
              alt="Maldives National Emblem" 
              className="w-[10em] h-[10em] mb-[1rem] object-contain"
            />
          </div>
          
          <div className="text-center">
            <h5 className="text-[1.25rem] font-medium leading-[1.2] mt-0 mb-[0.5rem] text-white">Ministry of Transport and Civil Aviation</h5>
            <h4 className="text-[1.5rem] font-medium leading-[1.2] mt-0 mb-[0.5rem] text-white">Vehicle Import Permit</h4>
          </div>

          {/* Conditional Rendering Based on Database Results */}
          {isLoading ? (
            <div className="text-center mt-8">
              <p className="text-lg text-[rgba(255,255,255,0.7)] animate-pulse">Connecting to secure database...</p>
            </div>
          ) : isError || !permit ? (
            <div className="bg-[#212529] rounded-[0.375rem] border border-[rgba(255,255,255,0.125)] flex flex-col min-w-0 break-words bg-clip-border shadow-[0_1rem_3rem_rgba(0,0,0,0.175)] mt-[1rem] mb-[1rem]">
              <div className="py-[0.5rem] px-[1rem] mb-0 bg-[#dc3545] border-b border-[rgba(255,255,255,0.125)] text-white rounded-t-[calc(0.375rem-1px)]">
                <h2 className="text-[1.25rem] font-medium leading-[1.2] mb-0">Verification Failed</h2>
              </div>
              <div className="flex-auto p-[1.5rem]">
                <div className="relative p-[1rem] mb-[1rem] border border-solid border-[#842029] rounded-[0.375rem] bg-[#2c0b0e] text-[#ea868f] flex items-center" role="alert">
                  <svg className="w-[1.5rem] h-[1.5rem] fill-current flex-shrink-0 mr-[0.5rem]" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  <div>
                    <strong className="font-bold text-white">Invalid Permit!</strong> This document could not be found in our database.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#212529] rounded-[0.375rem] border border-[rgba(255,255,255,0.125)] flex flex-col min-w-0 break-words bg-clip-border shadow-[0_1rem_3rem_rgba(0,0,0,0.175)] mt-[1rem] mb-[1rem]">
              <div className={`py-[0.5rem] px-[1rem] mb-0 ${permit.status === 'Valid' ? 'bg-[#198754]' : 'bg-[#dc3545]'} border-b border-[rgba(255,255,255,0.125)] text-white rounded-t-[calc(0.375rem-1px)]`}>
                <h2 className="text-[1.25rem] font-medium leading-[1.2] mb-0">Verification Results</h2>
              </div>
              
              <div className="flex-auto p-[1.5rem]">
                <div className={`relative p-[1rem] mb-[1rem] border border-solid rounded-[0.375rem] flex items-center ${permit.status === 'Valid' ? 'border-[#0f5132] bg-[#051b11] text-[#75b798]' : 'border-[#842029] bg-[#2c0b0e] text-[#ea868f]'}`} role="alert">
                  {permit.status === 'Valid' ? (
                    <svg className="w-[1.5rem] h-[1.5rem] fill-current flex-shrink-0 mr-[0.5rem]" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                  ) : (
                    <svg className="w-[1.5rem] h-[1.5rem] fill-current flex-shrink-0 mr-[0.5rem]" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                  )}
                  <div>
                    <strong className="font-bold text-white">
                      {permit.status === 'Valid' ? 'Document Verified!' : 'Document Invalid!'}
                    </strong> 
                    {permit.status === 'Valid' ? ' This document is authentic and valid.' : ` This document is marked as ${permit.status}.`}
                  </div>
                </div>

                <h3 className="text-[1rem] font-medium leading-[1.2] mt-[1.5rem] mb-[1rem] text-white">Document Details:</h3>
                
                <dl className="flex flex-wrap mt-0 mb-[1rem]">
                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Permit Number:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">{permit.permit_number}</dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Owner Name:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">{permit.owner_name}</dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Chassis Number:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">{permit.chassis_number}</dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Engine Number:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">{permit.engine_number}</dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Issue Date:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">
                    <span dir="rtl" className="unicode-bidi-embed font-thaana">{formatDhivehiDate(permit.issue_date)}</span>
                  </dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Due Date:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">
                    <span dir="rtl" className="unicode-bidi-embed font-thaana">{formatDhivehiDate(permit.due_date)}</span>
                  </dd>

                  <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white flex items-center">Status:</dt>
                  <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6] flex items-center">
                    <span className={`inline-block py-[0.35em] px-[0.65em] text-[0.75em] font-bold leading-none text-center whitespace-nowrap align-baseline rounded-[0.375rem] text-white ${permit.status === 'Valid' ? 'bg-[#198754]' : 'bg-[#dc3545]'}`}>
                      {permit.status}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto text-center text-[rgba(255,255,255,0.5)] pb-[1rem]">
          <p className="mt-0 mb-[1rem]">
            © Ministry of Transport & Civil Aviation <br />
            Republic of Maldives <br />
            <a href="https://transport.gov.mv" className="text-white text-decoration-underline hover:text-[rgba(255,255,255,0.75)] transition-colors">www.transport.gov.mv</a>
          </p>
        </footer>

      </div>
    </div>
  );
}

// Next.js requires components using useSearchParams to be wrapped in a Suspense boundary
export default function VerificationPortal() {
  return (
    <Suspense fallback={
      <div className="flex w-full min-h-screen items-center justify-center bg-[#283593]">
        <p className="text-white">Loading Verification Portal...</p>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}