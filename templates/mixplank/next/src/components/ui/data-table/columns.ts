"use client";

import { ColumnDef } from "@tanstack/react-table";

export function createColumns<T extends {}>(object: T): ColumnDef<T>[] {
  return Object.keys(object).map((key) => ({ accessorKey: key, header: key }));
}
