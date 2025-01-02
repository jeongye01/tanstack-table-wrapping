import { ColumnFiltersState, OnChangeFn, Updater } from "@tanstack/react-table";
import { useMemo, useState } from "react";

type ColumnFiltersMap<TData> = Map<keyof TData, TData[keyof TData]>;
export type KeyOf<T> = keyof T;
export const useColumnFilters = <TData>() => {
  const [columnFiltersMap, setColumnFiltersMap] = useState<
    ColumnFiltersMap<TData>
  >(new Map());
  const columnFilters = useMemo(
    () =>
      Array.from(columnFiltersMap.entries()).map(([id, value]) => ({
        id,
        value,
      })),
    [columnFiltersMap]
  );
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    filters: Updater<ColumnFiltersState>
  ) => {
    const newMap = new Map<keyof TData, TData[keyof TData]>();
    (filters as ColumnFiltersState).forEach((filter) => {
      newMap.set(filter.id as keyof TData, filter.value as TData[keyof TData]);
    });
    setColumnFiltersMap(newMap);
  };

  const setColumnFilter = (key: KeyOf<TData>, value: TData[KeyOf<TData>]) => {
    columnFiltersMap.set(key, value);
    console.log(key, value);
    setColumnFiltersMap(new Map(columnFiltersMap));
  };

  const getColumnFilter = (key: KeyOf<TData>) => {
    return columnFiltersMap.get(key);
  };

  const deleteColumnFilter = (key: KeyOf<TData>) => {
    columnFiltersMap.delete(key);
    setColumnFiltersMap(new Map(columnFiltersMap));
  };

  const setMultipleFilters = (
    filters: Array<{ key: KeyOf<TData>; value: TData[KeyOf<TData>] }>
  ) => {
    filters.forEach(({ key, value }) => columnFiltersMap.set(key, value));
    setColumnFiltersMap(new Map(columnFiltersMap));
  };

  const getMultipleFilters = (keys: KeyOf<TData>[]) => {
    return keys.map((key) => ({ key, value: columnFiltersMap.get(key) }));
  };

  const deleteMultipleFilters = (keys: KeyOf<TData>[]) => {
    keys.forEach((key) => columnFiltersMap.delete(key));
    setColumnFiltersMap(new Map(columnFiltersMap));
  };

  const getAllFilters = () => {
    return Array.from(columnFiltersMap.entries()).map(([key, value]) => ({
      key,
      value,
    }));
  };

  const clearAllFilters = () => {
    setColumnFiltersMap(new Map());
  };
  return {
    columnFilters,
    onColumnFiltersChange,
    setColumnFilter,
    getColumnFilter,
    deleteColumnFilter,
    setMultipleFilters,
    getMultipleFilters,
    deleteMultipleFilters,
    getAllFilters,
    clearAllFilters,
  };
};
