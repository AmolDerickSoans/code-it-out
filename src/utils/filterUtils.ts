export const filterBySelectedValues = <T>(
  data: T[],
  selectedValues: string[],
  key: keyof T
): T[] => {
  if (selectedValues.length > 0) {
    return data.filter((item) =>
      selectedValues.includes(item[key] as unknown as string)
    );
  }
  return data;
};
