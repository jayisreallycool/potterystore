import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Copy, Check } from 'lucide-react';

export function AuthDebugPanel() {
  const { user, isAdmin, loading, authError } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
      >
        <span>🔐 Auth Debug</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="space-y-3 text-xs">
            <div>
              <div className="font-semibold text-gray-700">Loading</div>
              <div className="text-gray-600">{loading ? 'True' : 'False'}</div>
            </div>

            <div>
              <div className="font-semibold text-gray-700">Authenticated</div>
              <div className="text-gray-600">{user ? 'Yes' : 'No'}</div>
            </div>

            <div>
              <div className="font-semibold text-gray-700">Is Admin</div>
              <div className="text-gray-600">{isAdmin ? 'Yes' : 'No'}</div>
            </div>

            {user && (
              <>
                <div>
                  <div className="font-semibold text-gray-700">User ID</div>
                  <div className="flex items-center gap-2">
                    <code className="text-gray-600 break-all flex-1">{user.uid}</code>
                    <button
                      onClick={() => copyToClipboard(user.uid, 'uid')}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy UID"
                    >
                      {copiedField === 'uid' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Email</div>
                  <div className="flex items-center gap-2">
                    <code className="text-gray-600 break-all flex-1">{user.email}</code>
                    <button
                      onClick={() => copyToClipboard(user.email || '', 'email')}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy Email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Display Name</div>
                  <div className="text-gray-600">{user.displayName || '(not set)'}</div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Email Verified</div>
                  <div className="text-gray-600">{user.emailVerified ? 'Yes' : 'No'}</div>
                </div>

                <div>
                  <div className="font-semibold text-gray-700">Auth Providers</div>
                  <div className="text-gray-600">
                    {user.providerData.length > 0
                      ? user.providerData.map(p => p.providerId).join(', ')
                      : '(none)'}
                  </div>
                </div>
              </>
            )}

            {authError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                <div className="font-semibold">Auth Error</div>
                <div className="break-all">{authError}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
