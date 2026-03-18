import React from 'react';

export default function VerificationPortal() {
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
      {/* 1:1 Bootstrap's "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column" */}
      <div className="flex flex-col w-full min-h-screen p-[1rem] mx-auto max-w-[62em]">
        
        {/* Header - "mb-auto text-center" */}
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

        {/* Main Content - "px-3" */}
        <main className="px-[1rem] w-full mt-[3rem]">
          
          <div className="text-center flex justify-center">
            {/* Loading emblem natively from the Next.js public folder */}
            <img 
              src="/emblem.svg" 
              alt="Maldives National Emblem" 
              className="w-[10em] h-[10em] mb-[1rem] object-contain"
            />
          </div>
          
          {/* Titles - "text-center" */}
          <div className="text-center">
            <h5 className="text-[1.25rem] font-medium leading-[1.2] mt-0 mb-[0.5rem] text-white">Ministry of Transport and Civil Aviation</h5>
            <h4 className="text-[1.5rem] font-medium leading-[1.2] mt-0 mb-[0.5rem] text-white">Vehicle Import Permit</h4>
          </div>

          {/* Results Card - "card shadow-lg" */}
          <div className="bg-[#212529] rounded-[0.375rem] border border-[rgba(255,255,255,0.125)] flex flex-col min-w-0 break-words bg-clip-border shadow-[0_1rem_3rem_rgba(0,0,0,0.175)] mt-[1rem] mb-[1rem]">
            
            {/* Card Header - "card-header bg-success text-white" */}
            <div className="py-[0.5rem] px-[1rem] mb-0 bg-[#198754] border-b border-[rgba(255,255,255,0.125)] text-white rounded-t-[calc(0.375rem-1px)]">
              <h2 className="text-[1.25rem] font-medium leading-[1.2] mb-0">Verification Results</h2>
            </div>
            
            {/* Card Body - "card-body p-4" */}
            <div className="flex-auto p-[1.5rem]">

              {/* Alert - "alert alert-success d-flex align-items-center" */}
              <div className="relative p-[1rem] mb-[1rem] border border-solid border-[#0f5132] rounded-[0.375rem] bg-[#051b11] text-[#75b798] flex items-center" role="alert">
                <svg className="w-[1.5rem] h-[1.5rem] fill-current flex-shrink-0 mr-[0.5rem]" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <div>
                  <strong className="font-bold text-white">Document Verified!</strong> This document is authentic and valid.
                </div>
              </div>

              <h3 className="text-[1rem] font-medium leading-[1.2] mt-[1.5rem] mb-[1rem] text-white">Document Details:</h3>
              
              {/* Description List - "dl row" matching Bootstrap grid mapping */}
              <dl className="flex flex-wrap mt-0 mb-[1rem]">
                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Permit Number:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">TA-T(L)2026/0060</dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Owner Name:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">HASSAAN KHALIDH</dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Chassis Number:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">FE13-420261</dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Engine Number:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">6AA-FE13</dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Issue Date:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">
                  <span dir="rtl" className="unicode-bidi-embed font-thaana">20 ޖެނުއަރީ 2026</span>
                </dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white">Due Date:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6]">
                  <span dir="rtl" className="unicode-bidi-embed font-thaana">20 މާޗް 2026</span>
                </dd>

                <dt className="w-full sm:flex-[0_0_auto] sm:w-[33.33333333%] font-bold text-white flex items-center">Status:</dt>
                <dd className="w-full sm:flex-[0_0_auto] sm:w-[66.66666667%] mb-[0.5rem] text-[#dee2e6] flex items-center">
                  <span className="inline-block py-[0.35em] px-[0.65em] text-[0.75em] font-bold leading-none text-center whitespace-nowrap align-baseline rounded-[0.375rem] bg-[#198754] text-white">Valid</span>
                </dd>
              </dl>
            </div>
          </div>

        </main>

        {/* Footer - "mt-auto text-center text-white-50" */}
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