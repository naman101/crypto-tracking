import queryString, { type ParseOptions } from 'query-string';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// Helper function to convert parameter values to strings
const searchParamsToString = <TValue extends Record<string, unknown>>(
  params: TValue
): Record<string, string> => {
  const data: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    data[key] = String(value);
  });
  return data;
};

// Custom hook to parse and manage URL search parameters
export function useParsedSearchParams<TValue extends Record<string, unknown>>(
  initialParams?: TValue, // Optional initial parameter values
  options?: ParseOptions // Optional parsing options for query strings
): [TValue, (params: Partial<TValue>) => void] {
  // Initialize URL search parameters with initial values if provided
  const [searchParams, setSearchParams] = useSearchParams(
    initialParams && searchParamsToString(initialParams)
  );
  const setSearchParamsRef = useRef(setSearchParams); // Store a ref to the setSearchParams function

  // Configure query string parsing options
  const queryStringOptions: ParseOptions = useMemo(
    () => ({
      parseBooleans: true,
      parseNumbers: true,
      arrayFormat: 'bracket', // e.g., `param[]=value1&param[]=value2`
      ...(options ? options : {}), // Merge with any provided options
    }),
    [options]
  );

  // Parse the URL search parameters into the desired type
  const parsedSearchParams = queryString.parse(
    searchParams.toString(),
    queryStringOptions
  ) as TValue;

  // Stable reference for setSearchParams to avoid dependency issues
  const setSearchParamsStable = useCallback(
    (...args: Parameters<typeof setSearchParams>) =>
      setSearchParamsRef.current(...args),
    []
  );

  // Function to update search parameters while preserving existing ones
  const changeSearchParams = useCallback(
    (params: Partial<TValue>) => {
      setSearchParamsStable(
        prevValue =>
          queryString.stringify(
            {
              ...queryString.parse(prevValue.toString(), queryStringOptions),
              ...params,
            },
            queryStringOptions
          ),
        { replace: true } // Replace the current entry in the history stack
      );
    },
    [setSearchParamsStable, queryStringOptions]
  );

  // Update the ref when setSearchParams changes to avoid stale closures
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  // Return parsed search parameters and the function to update them
  return [parsedSearchParams, changeSearchParams];
}
