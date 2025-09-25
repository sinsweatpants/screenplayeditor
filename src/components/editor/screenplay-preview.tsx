"use client";

import React from 'react';

type DialogueEntry = { character: string; text: string };

export type ExtractResult = {
  basmala?: string;
  'scene-header-1': string[];
  'scene-header-2': string[];
  'scene-header-3': string[];
  action: string[];
  character: string[];
  parenthetical: string[];
  dialogue: DialogueEntry[];
  transition: string[];
};

export default function ScreenplayPreview({ data }: { data: ExtractResult }) {
  const { basmala } = data;
  return (
    <div dir="rtl" className="screenplay-preview text-base leading-7">
      {basmala && <div className="basmala mb-8 font-bold text-left">{basmala}</div>}

      {/* Scene headers */}
      {data['scene-header-1'].map((h1, i) => (
        <div key={`hdr-${i}`} className="scene-header-container mb-4">
          <div className="scene-header-top-line flex justify-between w-full" style={{ direction: 'rtl' }}>
            <span className="scene-header-1 font-bold">{h1}</span>
            <span className="scene-header-2">{data['scene-header-2'][i] || ''}</span>
          </div>
          {data['scene-header-3'][i] && (
            <div className="scene-header-3 text-center font-bold">{data['scene-header-3'][i]}</div>
          )}
        </div>
      ))}

      {/* Action lines */}
      {data.action.map((a, idx) => (
        <p key={`act-${idx}`} className="action text-right my-1">
          {a}
        </p>
      ))}

      {/* Dialogue blocks */}
      {data.dialogue.map((d, idx) => (
        <div key={`dlg-${idx}`} className="dialogue-block text-center my-2">
          <div className="character font-bold uppercase mx-auto" style={{ width: '2.5in' }}>
            {d.character}
          </div>
          <div className="dialogue mx-auto" style={{ width: '2.5in', lineHeight: 1.2 }}>
            {d.text}
          </div>
        </div>
      ))}

      {/* Parentheticals */}
      {data.parenthetical.map((p, idx) => (
        <div key={`par-${idx}`} className="parenthetical text-center italic mx-auto" style={{ width: '2in' }}>
          {p}
        </div>
      ))}

      {/* Transitions */}
      {data.transition.map((t, idx) => (
        <div key={`tr-${idx}`} className="transition text-center font-bold uppercase my-1">
          {t}
        </div>
      ))}
    </div>
  );
}