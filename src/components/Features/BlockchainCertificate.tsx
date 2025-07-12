import React, { useState } from 'react';
import { Award, Shield, Download, Share2, CheckCircle } from 'lucide-react';

interface Certificate {
  id: string;
  skillName: string;
  issuerName: string;
  completedAt: string;
  blockchainHash: string;
  verificationUrl: string;
}

export function BlockchainCertificate() {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      skillName: 'React Development',
      issuerName: 'Sarah Smith',
      completedAt: '2024-12-15',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      verificationUrl: 'https://skillsync-verify.com/cert/1a2b3c4d'
    }
  ]);

  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async (skillName: string, learnerName: string) => {
    setIsGenerating(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newCert: Certificate = {
      id: Date.now().toString(),
      skillName,
      issuerName: learnerName,
      completedAt: new Date().toISOString().split('T')[0],
      blockchainHash: `0x${Math.random().toString(16).substr(2, 32)}`,
      verificationUrl: `https://skillsync-verify.com/cert/${Math.random().toString(16).substr(2, 8)}`
    };
    
    setCertificates([...certificates, newCert]);
    setIsGenerating(false);
    setShowGenerator(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Award className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Blockchain Certificates</h2>
            <p className="text-gray-600 text-sm">Verified skill completion certificates</p>
          </div>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600"
        >
          Generate Certificate
        </button>
      </div>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.skillName}</h3>
                  <p className="text-sm text-gray-600">Taught by {cert.issuerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Verified</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-600">Completed:</p>
                <p className="font-medium">{new Date(cert.completedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Blockchain Hash:</p>
                <p className="font-mono text-xs text-blue-600">{cert.blockchainHash.substring(0, 20)}...</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                <Download size={14} />
                <span>Download</span>
              </button>
              <button className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                <Share2 size={14} />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                <Shield size={14} />
                <span>Verify</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Blockchain Certificate</h3>
            
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Generating certificate on blockchain...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                  <input
                    type="text"
                    defaultValue="JavaScript Fundamentals"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learner Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <Shield size={16} className="inline mr-1" />
                    This certificate will be permanently stored on the blockchain and cannot be modified.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generateCertificate("JavaScript Fundamentals", "John Doe")}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600"
                  >
                    Generate Certificate
                  </button>
                  <button
                    onClick={() => setShowGenerator(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}