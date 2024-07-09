import { useState } from "react";
import Select, { SelectOptions } from "./Select";

const options = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "Third", value: 3 },
  { label: "Fourth", value: 4 },
  { label: "Fifth", value: 5 },
];

const App = () => {
  const [value1, setValue1] = useState<SelectOptions | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOptions[]>([options[0]]);
  return (
    <>
      <Select value={value1} options={options} onChange={(o) => setValue1(o)} />
      <br />
      <Select
        multible={true}
        value={value2}
        options={options}
        onChange={(o) => setValue2(o)}
      />
    </>
  );
};
export default App;
