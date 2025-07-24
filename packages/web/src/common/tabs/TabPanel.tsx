import { type JSX } from "react";

interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

export default function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && (<>
        {children}
      </>)}
    </div>
  );
}
