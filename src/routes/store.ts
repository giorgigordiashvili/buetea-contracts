import { z } from "zod";
import { defineRoute } from "../http.js";

const adminRoles = ["ADMIN", "OWNER"];
const zAnyObject = z.object({}).passthrough();

const zStoreType = z.enum(["STORE", "RESTAURANT"]);

const zCreateStore = z.object({
  name: z.string().min(1),
  type: zStoreType,
  address: z.string().min(1),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
});

const zUpdateStore = z.object({
  name: z.string().optional(),
  type: zStoreType.optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

const zCreateInventory = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  year: z.number().min(2000),
  quantityGivenKg: z.number().min(0),
  quantityGivenUnits: z.number().min(0).optional(),
  quantitySoldKg: z.number().min(0),
  quantitySoldUnits: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const zUpdateInventory = z.object({
  quantityGivenKg: z.number().min(0).optional(),
  quantityGivenUnits: z.number().min(0).optional(),
  quantitySoldKg: z.number().min(0).optional(),
  quantitySoldUnits: z.number().min(0).optional(),
  notes: z.string().optional(),
});

/** Physical store/restaurant management + monthly inventory tracking. */
export const storeContracts = {
  createStore: defineRoute({
    method: "POST",
    path: "/admin/store",
    auth: "roles",
    roles: adminRoles,
    body: zCreateStore,
    response: zAnyObject,
  }),
  getAllStores: defineRoute({
    method: "GET",
    path: "/admin/store",
    auth: "roles",
    roles: adminRoles,
    query: z.object({ isActive: z.string().optional() }),
    response: z.array(zAnyObject),
  }),
  getStoreById: defineRoute({
    method: "GET",
    path: "/admin/store/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: zAnyObject,
  }),
  updateStore: defineRoute({
    method: "PATCH",
    path: "/admin/store/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    body: zUpdateStore,
    response: zAnyObject,
  }),
  deleteStore: defineRoute({
    method: "DELETE",
    path: "/admin/store/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: zAnyObject,
  }),
  addInventory: defineRoute({
    method: "POST",
    path: "/admin/store/:storeId/inventory",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ storeId: z.string() }),
    body: zCreateInventory,
    response: zAnyObject,
  }),
  updateInventory: defineRoute({
    method: "PATCH",
    path: "/admin/store/:storeId/inventory/:inventoryId",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ storeId: z.string(), inventoryId: z.string() }),
    body: zUpdateInventory,
    response: zAnyObject,
  }),
  getStoreInventory: defineRoute({
    method: "GET",
    path: "/admin/store/:storeId/inventory",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ storeId: z.string() }),
    response: z.array(zAnyObject),
  }),
  getStoreInventoryByMonth: defineRoute({
    method: "GET",
    path: "/admin/store/:storeId/inventory/:month/:year",
    auth: "roles",
    roles: adminRoles,
    params: z.object({
      storeId: z.string(),
      month: z.string(),
      year: z.string(),
    }),
    response: zAnyObject,
  }),
  getAllStoresInventory: defineRoute({
    method: "GET",
    path: "/admin/store/inventory/:month/:year",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ month: z.string(), year: z.string() }),
    response: zAnyObject,
  }),
  getStoreStatistics: defineRoute({
    method: "GET",
    path: "/admin/store/:storeId/statistics",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ storeId: z.string() }),
    response: zAnyObject,
  }),
} as const;
