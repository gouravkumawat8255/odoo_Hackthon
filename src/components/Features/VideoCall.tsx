import React, { useState } from 'react';
import { Video, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, Users } from 'lucide-react';

interface VideoCallProps {
  isActive: boolean;
  onEnd: () => void;
  participantName: string;
}

export function VideoCall({ isActive, onEnd, participantName }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          {isCameraOff ? (
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={48} />
              </div>
              <p className="text-xl">{participantName}</p>
              <p className="text-gray-400">Camera is off</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video size={64} />
                </div>
                <p className="text-2xl font-semibold">{participantName}</p>
                <p className="text-purple-200">Connected via SkillSync</p>
              </div>
            </div>
          )}
        </div>

        {/* Self Video (Picture in Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
          {isCameraOff ? (
            <div className="w-full h-full flex items-center justify-center text-white">
              <CameraOff size={24} />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white">
              <Camera size={24} />
            </div>
          )}
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live • {formatDuration(callDuration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? <MicOff className="text-white" size={24} /> : <Mic className="text-white" size={24} />}
          </button>

          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-4 rounded-full transition-colors ${
              isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isCameraOff ? <CameraOff className="text-white" size={24} /> : <Camera className="text-white" size={24} />}
          </button>

          <button
            onClick={onEnd}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <PhoneOff className="text-white" size={24} />
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Learning session with {participantName}
          </p>
        </div>
      </div>
    </div>
  );
}