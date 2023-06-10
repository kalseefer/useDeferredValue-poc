import { Suspense, useDeferredValue, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true
    }
  }
});

export default function App() {
  const [normalState, setNormalState] = useState(1);
  const deferred = useDeferredValue(normalState);
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<h1>Suspended</h1>}>
        <div className="App">
          <button onClick={() => setNormalState((s) => s + 1)}>Inc</button>
          <p>Normal state: {normalState}</p>
          <Component deferred={deferred} />
        </div>
      </Suspense>
    </QueryClientProvider>
  );
}

function Component({ deferred }) {
  const { data } = useQuery({
    queryKey: [deferred],
    queryFn: () => mockQuery(deferred)
  });
  return <p>Deferred value: {data}</p>;
}

const mockQuery = async (val) => {
  console.debug(`trigerred with value: ${val}`);
  return new Promise((r) => setTimeout(() => r(val), 2000));
};
