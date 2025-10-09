import { useState } from "react";
import axios from "axios";

const Verify = () => {
  const [credentialId, setCredentialId] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const handleVerify = async () => {
    if (!credentialId.trim()) {
      setResponse("Please enter a credential ID");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setIsVerified(null);
    
    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_URL, {
        credentialId,
      });
      setResponse(JSON.stringify(res.data, null, 2));
      setIsVerified(true);
    } catch (err: any) {
      setResponse("Error: " + err.message);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Credential Verification
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-center">
            Enter the credential ID to verify its authenticity and view details
          </p>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Credential ID"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              onClick={handleVerify}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <span className="inline-block animate-pulse">Verifying...</span>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </div>

        {isVerified !== null && (
          <div className={`mb-6 p-4 rounded-lg ${isVerified ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
            <p className={`text-lg font-medium ${isVerified ? 'text-green-700' : 'text-red-700'}`}>
              {isVerified 
                ? '✅ Credential verified successfully!' 
                : '❌ Verification failed'}
            </p>
          </div>
        )}

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Verification Response:
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
