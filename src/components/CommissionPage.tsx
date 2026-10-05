import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { PotteryProduct } from '../types';
import { submitInquiry } from '../services/storeService';
import { useAuth } from '../context/AuthContext';

interface CommissionPageProps {
  /** A sold or existing piece the customer wants something similar to */
  referencePiece?: PotteryProduct | null;
  onBrowsePieces: () => void;
}

const PIECE_TYPES = [
  'Mugs or cups',
  'Bowls',
  'Plates or platters',
  'Vase',
  'Pitcher',
  'Planter',
  'Candle holders',
  'Dinnerware set',
  'Something else',
];

const BUDGETS = ['Under $100', '$100 – $250', '$250 – $500', '$500 – $1,000', 'Over $1,000', 'Not sure yet'];

const fieldClass =
  'w-full min-h-[46px] bg-white border border-[#D9CEBE] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#2C2723] placeholder-[#A39587] focus:outline-none focus:border-[#B9552D] focus:ring-2 focus:ring-[#B9552D]/20';
const labelClass = 'block text-sm font-medium text-[#2C2723] mb-1.5';
const hintClass = 'text-xs text-[#7A6C5F] mt-1';

export const CommissionPage: React.FC<CommissionPageProps> = ({ referencePiece, onBrowsePieces }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    pieceType: PIECE_TYPES[0],
    quantity: '1',
    size: '',
    colors: '',
    budget: BUDGETS[BUDGETS.length - 1],
    neededBy: '',
    referenceLink: '',
    details: referencePiece ? `I'd like something similar to "${referencePiece.name}".` : '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const lines = [
      `Custom order request`,
      `Piece: ${form.pieceType}`,
      `Quantity: ${form.quantity}`,
      form.size && `Size: ${form.size}`,
      form.colors && `Glaze / colours: ${form.colors}`,
      `Budget: ${form.budget}`,
      form.neededBy && `Needed by: ${form.neededBy}`,
      form.referenceLink && `Reference link: ${form.referenceLink}`,
      referencePiece && `Similar to: ${referencePiece.name} (${referencePiece.id})`,
      '',
      form.details,
    ].filter((line) => line !== false && line !== undefined && line !== null);

    try {
      await submitInquiry({
        id: `commission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: form.name.trim().slice(0, 200),
        email: form.email.trim().slice(0, 200),
        message: lines.join('\n').slice(0, 5000),
        pieceOfInterest: `Custom order: ${form.pieceType}`,
        createdAt: new Date().toISOString(),
        status: 'unread',
      });
      setStatus('sent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#4E7755]/15 text-[#4E7755] flex items-center justify-center mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2723]">Request sent</h1>
        <p className="text-sm sm:text-base text-[#544A41] mt-3 leading-relaxed">
          Thanks, {form.name.split(' ')[0] || 'friend'}. Cliff will read your request and reply to {form.email} with
          questions, a price and a timeline before any work starts.
        </p>
        <button
          onClick={onBrowsePieces}
          className="mt-7 min-h-[48px] px-6 rounded-full bg-[#2C2723] text-[#FAF7F2] hover:bg-[#3F3732] text-sm font-semibold transition-colors"
        >
          Browse available pieces
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Intro */}
        <div className="lg:col-span-5">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C2723] leading-[1.05] tracking-tight">
            Have a piece made for you
          </h1>
          <p className="text-sm sm:text-base text-[#544A41] mt-4 leading-relaxed max-w-md">
            Every Cliff Cooks piece is thrown and glazed by hand, so a custom order is just a conversation about what
            you want on your table. Tell Cliff what you have in mind and he'll reply by email.
          </p>

          <ol className="mt-8 space-y-5 max-w-md">
            {[
              ['Send the request', 'Describe the piece, size, colours and how many you need.'],
              ['Agree the details', 'Cliff replies with questions, a price and a timeline. Nothing is made until you say yes.'],
              ['Made by hand', 'Your piece is thrown, glazed and fired, then packed and shipped to you.'],
            ].map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#B9552D] text-[#FAF7F2] font-serif text-lg flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[#2C2723]">{title}</h2>
                  <p className="text-sm text-[#695E54] mt-0.5 leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          {referencePiece && (
            <div className="mt-8 p-4 rounded-2xl bg-[#F2EDE4] border border-[#E3D9CB] max-w-md text-sm text-[#544A41]">
              You're asking about a piece similar to{' '}
              <span className="font-semibold text-[#2C2723]">{referencePiece.name}</span>.
            </div>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-5 sm:p-8 rounded-3xl bg-[#F6F1E8] border border-[#E3D9CB] space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="co-name" className={labelClass}>Your name</label>
              <input id="co-name" required maxLength={200} autoComplete="name" value={form.name} onChange={set('name')} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="co-email" className={labelClass}>Email</label>
              <input id="co-email" type="email" required maxLength={200} autoComplete="email" value={form.email} onChange={set('email')} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="co-type" className={labelClass}>What would you like made?</label>
              <select id="co-type" value={form.pieceType} onChange={set('pieceType')} className={fieldClass}>
                {PIECE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="co-qty" className={labelClass}>How many?</label>
              <input id="co-qty" type="number" min={1} max={500} required value={form.quantity} onChange={set('quantity')} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="co-size" className={labelClass}>Size</label>
              <input id="co-size" maxLength={200} value={form.size} onChange={set('size')} placeholder="e.g. 12 oz mug, 10 in plate" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="co-colors" className={labelClass}>Glaze or colours</label>
              <input id="co-colors" maxLength={200} value={form.colors} onChange={set('colors')} placeholder="e.g. deep green, speckled white" className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="co-budget" className={labelClass}>Budget</label>
              <select id="co-budget" value={form.budget} onChange={set('budget')} className={fieldClass}>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="co-date" className={labelClass}>Needed by</label>
              <input id="co-date" type="date" value={form.neededBy} onChange={set('neededBy')} className={fieldClass} />
              <p className={hintClass}>Leave blank if there's no deadline.</p>
            </div>
          </div>

          <div>
            <label htmlFor="co-link" className={labelClass}>Link to a reference photo</label>
            <input id="co-link" type="url" maxLength={500} value={form.referenceLink} onChange={set('referenceLink')} placeholder="https://" className={fieldClass} />
            <p className={hintClass}>Optional. A photo, Pinterest pin or Instagram post that shows the look you want.</p>
          </div>

          <div>
            <label htmlFor="co-details" className={labelClass}>Tell Cliff about it</label>
            <textarea id="co-details" required rows={5} maxLength={3500} value={form.details} onChange={set('details')} placeholder="Who is it for, how will it be used, anything it must or must not have." className={`${fieldClass} resize-y`} />
          </div>

          {status === 'error' && (
            <p role="alert" className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
              The request didn't send. Check your connection and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto min-h-[50px] px-7 rounded-full bg-[#B9552D] text-white hover:bg-[#A44924] disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{status === 'sending' ? 'Sending…' : 'Send request'}</span>
          </button>
          <p className="text-xs text-[#7A6C5F]">Sending a request is free and doesn't commit you to buying.</p>
        </form>
      </div>
    </section>
  );
};
