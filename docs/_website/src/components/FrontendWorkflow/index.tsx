import React from "react"; // Import React for JSX support

import Link from "@docusaurus/Link"; // Import Link component from Docusaurus for navigation
import type { Props as LinkProps } from "@docusaurus/Link"; // Import Link prop types

import "./styles.css"; // Import component-specific styles

// Define the props for FrontendWorkflow component.
// Extends LinkProps by picking the "to" property and adds custom properties

interface FrontendWorkflowProps extends Pick<LinkProps, "to"> {
  packageName: string;
  workflows?: React.ReactNode[];
}

const FrontendWorkflow = ({
  packageName,
  to,
  workflows,
}: FrontendWorkflowProps): JSX.Element => (
  <Link to={to} className="fw-container">
    <div className="fw-title">{packageName}</div>
    {workflows !== null && (
      <div className="fw-workflow-list">
        {workflows?.map((v, idx) => (
          <li key={idx}>{v}</li>
        ))}
      </div>
    )}
  </Link>
);

export default FrontendWorkflow;
