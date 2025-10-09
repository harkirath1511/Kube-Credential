import { useState } from "react";
import axios from "axios";

const Issue = () => {
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleIssue = async () => {
    if (!name.trim() || !credential.trim()) {
      setResponse("Please fill in all fields");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setResponse("");
    setIsSuccess(null);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/gen`, {
        name,
        credential,
      });
      console.log(res);
      setResponse(JSON.stringify(res.data, null, 2));
      setIsSuccess(true);
    } catch (err: any) {
      setResponse("Error: " + err.response.data.message);
      console.log(err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Credential Issuance
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-center">
            Fill in the details below to issue a new digital credential
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter recipient's full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-1">
                Credential Type
              </label>
              <input
                id="credential"
                type="text"
                placeholder="e.g., Certificate, License, Badge"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="pt-2">
              <button 
                onClick={handleIssue}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse">Processing...</span>
                ) : (
                  "Issue Credential"
                )}
              </button>
            </div>
          </div>
        </div>

        {isSuccess !== null && (
          <div className={`mb-6 p-4 rounded-lg ${isSuccess ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
            <p className={`text-lg font-medium ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
              {isSuccess 
                ? '✅ Credential issued successfully!' 
                : '❌ There was a problem issuing the credential'}
            </p>
          </div>
        )}

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Response Details:
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {response}
            </pre>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Credentials are securely issued using blockchain technology
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issue;
