import React from "react"; // Import React for JSX support

import "./styles.css"; // Import component-specific styles

// Define props for the Image component.
// - variant: A string representing the CSS class for the container div.
// - ...props: Any additional props passed to the <img> element (e.g., src, alt).
interface ImageProps {
  variant: string;
}

// Image component wraps an <img> element in a <div> with a class based on the variant prop.
const Image = ({ variant, ...props }: ImageProps): JSX.Element => (
  <div className={variant}>
    <img {...props} />
  </div>
);

export default Image; // Export the component for use in other modules
