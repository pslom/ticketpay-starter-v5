import React from 'react';
import { ExampleAlertCopy } from '@/lib/copy';
import { Card } from './Card';

export default function ExampleAlert({ plate = '7ABC123', state = 'CA' }: { plate?: string; state?: string }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold mb-2">{ExampleAlertCopy.cardTitle}</h3>

      <div className="space-y-4 text-sm">
        <div>
          <div className="font-medium">SMS</div>
          <div className="mt-1 bg-grayA p-3 rounded">
            <pre className="whitespace-pre-wrap text-xs leading-tight">{ExampleAlertCopy.sms(plate, state)}</pre>
          </div>
        </div>

        <div>
          <div className="font-medium">Email subject</div>
          <div className="mt-1 text-sm">{ExampleAlertCopy.emailSubject(plate, state)}</div>
        </div>

        <div>
          <div className="font-medium">Email body</div>
          <div className="mt-1 bg-grayA p-3 rounded">
            <pre className="whitespace-pre-wrap text-sm leading-tight">{ExampleAlertCopy.emailBody(plate, state)}</pre>
          </div>
        </div>
      </div>
    </Card>
  );
}
