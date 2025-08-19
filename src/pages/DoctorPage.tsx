import React, { useState, useRef } from 'react';
import { Mic, FileText, CheckCircle, Search, Play, Square } from 'lucide-react';

const DoctorPage = () => {
  const [activeTab, setActiveTab] = useState('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const form = new FormData();
          form.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: form });
          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json();
          setTranscription(data.transcript || '');
        } catch (e: any) {
          setError(e.message || 'Failed to transcribe');
        }
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (e: any) {
      setError('Microphone access denied or unsupported.');
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    mediaRecorderRef.current = null;
  };

  const handlePatientSearch = () => {
    if (patientId) {
      console.log(`Searching for patient: ${patientId}`);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Doctor Portal
          </h1>
          <p className="text-xl text-gray-600">
            Voice-to-report generation, AI summaries, and patient record access
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('voice')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'voice'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Voice to Text
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Summary
              </button>
              <button
                onClick={() => setActiveTab('approve')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approve'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Review & Approve
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Patient Records
              </button>
            </nav>
          </div>
        </div>

        {/* Voice to Text Tab */}
        {activeTab === 'voice' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Mic className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Voice to Text Conversion</h2>
            </div>

            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
              }`}>
                <Mic className={`h-16 w-16 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
              </div>

              <div className="space-x-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center mx-auto"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </button>
                )}
              </div>

              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </div>

            {transcription && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transcription:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-gray-700 whitespace-pre-wrap font-sans">{transcription}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Summary Tab */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Summary</h2>
            </div>

            {transcription ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Transcription:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans">{transcription}</pre>
                  </div>
                </div>

                {summary && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Generated Summary:</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <pre className="text-gray-700 whitespace-pre-wrap font-sans">{summary}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Please record a voice note first to generate a summary</p>
              </div>
            )}
          </div>
        )}

        {/* Review & Approve Tab */}
        {activeTab === 'approve' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Review & Approve</h2>
            </div>

            {summary ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Summary for Review:</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <textarea
                      className="w-full h-64 p-3 border-0 resize-none focus:outline-none"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve & Send to HIS
                  </button>
                  <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                    Save as Draft
                  </button>
                  <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Please generate a summary first to review and approve</p>
              </div>
            )}
          </div>
        )}

        {/* Patient Records Tab */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Search className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Patient Records Access</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Unique ID
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient unique number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePatientSearch}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPage;