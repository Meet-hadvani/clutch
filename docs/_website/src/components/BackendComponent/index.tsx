import React from "react"; // Import React for JSX support

import Link from "@docusaurus/Link"; // Import Link component from Docusaurus
import type { Props as LinkProps } from "@docusaurus/Link"; // Import type for Link props

import "./styles.css"; // Import component-specific styles

// Define the props for the BackendComponent
// It extends the LinkProps by picking the "to" property and adds custom props for name and description.
interface BackendComponentProps extends Pick<LinkProps, "to"> {
  name: string; // The display name of the backend component
  desc: string; // The description text for the backend component
}

// Functional component that renders a backend link with a title and an optional description.
// It uses the Docusaurus Link component to handle navigation.
const BackendComponent = ({
  name,
  desc,
  to,
}: BackendComponentProps): JSX.Element => (
  // The Link opens the target in a new tab (target="_blank")
  <Link className="bc-container" to={to} target="_blank">
    <div className="bc-title">{name}</div> {/* Render the component title */}
    {desc !== "" && <div className="bc-description">{desc}</div>} {/* Conditionally render description */}
  </Link>
);

export default BackendComponent; // Export the component for use in other parts of the application
