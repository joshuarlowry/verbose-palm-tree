import React from 'react';
import type { Submission } from '../store/formSlice';

export interface SubmissionsListProps {
  submissions: Submission[];
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions }) => {
  return (
    <div className="submissions">
      <h2>Submissions</h2>
      {submissions.length === 0 ? (
        <div className="muted">No submissions yet.</div>
      ) : (
        <ul>
          {submissions.map((s) => (
            <li key={s.id}>
              <div>
                <strong>{new Date(s.submittedAt).toLocaleString()}</strong>
              </div>
              <pre>{JSON.stringify(s.values, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
